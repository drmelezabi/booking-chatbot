import starkString from "starkstring";
import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import isAdmin from "../../controllers/rules/isAdmin";
import updateRooms from "../../controllers/rules/update/updateRooms";

const updateRoomsResolve = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const chatId = message.from;
  try {
    // ---------------- Is Admin ----------------
    const errorMessage = await isAdmin(chatId);
    if (typeof errorMessage === "string") {
      await client.sendMessage(chatId, errorMessage);
      return;
    }
    // ------------------------------------------
    const query = message.body
      .substring("!غرف".length)
      .trim()
      .replace(/\s+/g, " ");

    const addRaw: string[] = [];
    const removeRaw: string[] = [];

    const table = query.split(" ").map((room) => room.replace(/-/g, " "));

    const addMainIndex = table.findIndex((value) =>
      /^(?:و)?[إأآا]ضاف[ةه]/.test(value)
    );
    const removeMainIndex = table.findIndex((value) =>
      /^(?:و)?حذف/.test(value)
    );

    for (let index = 0; index < table.length; index++) {
      const element = table[index];

      const format = (str: string) => {
        return str
          .replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (match) =>
            starkString(match).englishNumber().toString()
          )
          .trim();
      };

      if (addMainIndex >= 0 && removeMainIndex >= 0) {
        if (addMainIndex < removeMainIndex) {
          if (
            index > addMainIndex &&
            index != removeMainIndex &&
            index < removeMainIndex
          ) {
            addRaw.push(format(element));
          }
          if (index > removeMainIndex && index != addMainIndex) {
            removeRaw.push(format(element));
          }
        } else {
          if (
            index > removeMainIndex &&
            index != addMainIndex &&
            index < addMainIndex
          ) {
            removeRaw.push(format(element));
          }
          if (index > addMainIndex && index != removeMainIndex) {
            addRaw.push(format(element));
          }
        }
      } else {
        if (addMainIndex >= 0 && index > addMainIndex) {
          addRaw.push(format(element));
        } else if (removeMainIndex >= 0 && index > removeMainIndex) {
          removeRaw.push(format(element));
        }
      }
    }

    console.log({ addRaw, removeRaw });
    const res = await updateRooms(addRaw, removeRaw);

    // ------------------------------------------
    const msg: string[] = [];

    if (addRaw.length) msg.push("الإضافة");
    if (removeRaw.length) msg.push("الحذف");

    if (typeof res === "string") await client.sendMessage(chatId, res);
    if (query.length)
      await client.sendMessage(chatId, `تمت عملية ${msg.join(" و ")} بنجاح`);
  } catch (error) {
    throw ErrorHandler(error, "updateRoomsResolve");
  }
};

export default updateRoomsResolve;
