import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/accounts/isAdmin";
import updateBlockedDates from "../../controllers/rules/update/updateBlockedDay";
type blockedDates = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

const updateBlockedDatesResolve = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const chatId = message.from;
  // ---------------- Is Admin ----------------
  const errorMessage = await isAdmin(chatId);
  if (typeof errorMessage === "string") {
    await client.sendMessage(chatId, errorMessage);
    return;
  }
  // ------------------------------------------
  const query = message.body
    .substring("!حجب".length)
    .trim()
    .replace(/[^a-zA-Z\u0621-\u064A]/g, " ")
    .replace(/\s+/g, " ");

  const add: blockedDates[] = [];
  const remove: blockedDates[] = [];

  const addRaw: string[] = [];
  const removeRaw: string[] = [];

  const table = query.split(" ");

  const addMainIndex = table.findIndex((value) =>
    /^(?:و)?[إأآا]ضاف[ةه]/.test(value)
  );
  const removeMainIndex = table.findIndex((value) => /^(?:و)?حذف/.test(value));

  for (let index = 0; index < table.length; index++) {
    const element = table[index];

    if (addMainIndex >= 0 && removeMainIndex >= 0) {
      if (addMainIndex < removeMainIndex) {
        if (
          index > addMainIndex &&
          index != removeMainIndex &&
          index < removeMainIndex
        ) {
          addRaw.push(element);
        }
        if (index > removeMainIndex && index != addMainIndex) {
          removeRaw.push(element);
        }
      } else {
        if (
          index > removeMainIndex &&
          index != addMainIndex &&
          index < addMainIndex
        ) {
          removeRaw.push(element);
        }
        if (index > addMainIndex && index != removeMainIndex) {
          addRaw.push(element);
        }
      }
    } else {
      if (addMainIndex >= 0 && index > addMainIndex) {
        addRaw.push(element);
      } else if (removeMainIndex >= 0 && index > removeMainIndex) {
        removeRaw.push(element);
      }
    }
  }

  // Iterate through the array
  for (let i = 0; i < addRaw.length; i++) {
    let currentItem = addRaw[i];

    // Check if the current item exists as a key in the replacement object
    if (rephrase[currentItem]) {
      // If it exists, replace the array item with the corresponding value
      addRaw[i] = rephrase[currentItem];
    } else {
      // If it doesn't exist, remove this item from the array
      addRaw.splice(i, 1);
      i--; // Decrement i to account for the removed item
    }
  }

  // Iterate through the array
  for (let i = 0; i < removeRaw.length; i++) {
    let currentItem = removeRaw[i];

    // Check if the current item exists as a key in the replacement object
    if (rephrase[currentItem]) {
      // If it exists, replace the array item with the corresponding value
      removeRaw[i] = rephrase[currentItem];
    } else {
      // If it doesn't exist, remove this item from the array
      removeRaw.splice(i, 1);
      i--; // Decrement i to account for the removed item
    }
  }

  const res = await updateBlockedDates(
    addRaw as blockedDates[],
    removeRaw as blockedDates[]
  );

  // ------------------------------------------
  const msg: string[] = [];

  if (addRaw.length) msg.push("الإضافة");
  if (removeRaw.length) msg.push("الحذف");

  console.log(res);

  if (typeof res === "string") await client.sendMessage(chatId, res);
  await client.sendMessage(chatId, `تمت عملية ${msg.join(" و ")} بنجاح`);
};

export default updateBlockedDatesResolve;
