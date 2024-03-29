import starkString from "starkstring";
import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../../config/errorhandler";
import getAccountsString from "../../../controllers/accounts/get/getAccounts";
import isSuperAdmin from "../../../controllers/rules/isSuperAdmin";
import RegisteredPhone from "../../../database/RegisteredPhone";

const getPermissionList = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  try {
    const registeredData = RegisteredPhone.fetch(
      (account) => account.chatId === message.from
    );
    if (!registeredData) {
      client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
      return;
    }
    const { from: chatId } = message;
    // ---------------- Is Admin ----------------
    const errorMessage = await isSuperAdmin(chatId);
    if (typeof errorMessage === "string") {
      await client.sendMessage(chatId, errorMessage);
      return;
    }

    const isExist = RegisteredPhone.fetch(
      (account) => account.chatId === message.from
    );
    if (!isExist) {
      client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
      return;
    }

    const msg = (await getAccountsString()).replace(/[\d]/g, (match) =>
      starkString(match).englishNumber().toString()
    );

    client.sendMessage(chatId, msg);
  } catch (error) {
    throw ErrorHandler(error, "getPermissionList");
  }
};

export default getPermissionList;
