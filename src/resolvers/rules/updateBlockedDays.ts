import WAWebJS from "whatsapp-web.js";

import isAdmin from "../../controllers/rules/isAdmin";
import updateBlockedDays from "../../controllers/rules/update/updateBlockedDay";
type blockedDays = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
const rephrase: { [key: string]: blockedDays } = {
  الاثنين: "Mon",
  الاتنين: "Mon",
  الثلاثاء: "Tue",
  الثلاث: "Tue",
  التلات: "Tue",
  ثلاث: "Tue",
  تلاتث: "Tue",
  الأربعاء: "Wed",
  الاربعاء: "Wed",
  الأربع: "Wed",
  الاربع: "Wed",
  أربع: "Wed",
  اربع: "Wed",
  الخميس: "Thu",
  خميس: "Thu",
  جمعه: "Fri",
  جمعة: "Fri",
  الجمعة: "Fri",
  الجمعه: "Fri",
  السبت: "Sat",
  سبت: "Sat",
  الأحد: "Sun",
  الاحد: "Sun",
  أحد: "Sun",
  احد: "Sun",
  حد: "Sun",
  والاثنين: "Mon",
  والاتنين: "Mon",
  والثلاثاء: "Tue",
  والثلاث: "Tue",
  والتلات: "Tue",
  وثلاث: "Tue",
  وتلاتث: "Tue",
  والأربعاء: "Wed",
  والاربعاء: "Wed",
  والأربع: "Wed",
  والاربع: "Wed",
  وأربع: "Wed",
  واربع: "Wed",
  والخميس: "Thu",
  وخميس: "Thu",
  وجمعه: "Fri",
  وجمعة: "Fri",
  والجمعة: "Fri",
  والجمعه: "Fri",
  والسبت: "Sat",
  وسبت: "Sat",
  والأحد: "Sun",
  والاحد: "Sun",
  وأحد: "Sun",
  واحد: "Sun",
  وحد: "Sun",
  ألاثنين: "Mon",
  ألاتنين: "Mon",
  ألثلاثاء: "Tue",
  ألثلاث: "Tue",
  ألتلات: "Tue",
  ألأربعاء: "Wed",
  ألاربعاء: "Wed",
  ألأربع: "Wed",
  ألاربع: "Wed",
  ألخميس: "Thu",
  ألجمعة: "Fri",
  ألجمعه: "Fri",
  ألسبت: "Sat",
  ألأحد: "Sun",
  ألاحد: "Sun",
  وألاثنين: "Mon",
  وألاتنين: "Mon",
  وألثلاثاء: "Tue",
  وألثلاث: "Tue",
  وألتلات: "Tue",
  وألأربعاء: "Wed",
  وألاربعاء: "Wed",
  وألأربع: "Wed",
  وألاربع: "Wed",
  وألخميس: "Thu",
  وألجمعة: "Fri",
  وألجمعه: "Fri",
  وألسبت: "Sat",
  وألأحد: "Sun",
  وألاحد: "Sun",
};

const updateBlockedDaysResolve = async (
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
    const currentItem = addRaw[i];

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
    const currentItem = removeRaw[i];

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

  const res = await updateBlockedDays(
    addRaw as blockedDays[],
    removeRaw as blockedDays[]
  );

  // ------------------------------------------
  const msg: string[] = [];

  if (addRaw.length) msg.push("الإضافة");
  if (removeRaw.length) msg.push("الحذف");

  if (typeof res === "string") await client.sendMessage(chatId, res);
  if (query.length)
    await client.sendMessage(chatId, `تمت عملية ${msg.join(" و ")} بنجاح`);
};

export default updateBlockedDaysResolve;
