import WAWebJS from "whatsapp-web.js";

import getPermissionList from "./getPermissionsList";
import updatePermissions from "./updatePermissions";
import ErrorHandler from "../../../config/errorhandler";
import isSuperAdmin from "../../../controllers/rules/isSuperAdmin";
import Chat from "../../../database/chat";
import RegisteredPhone from "../../../database/RegisteredPhone";

const permissionsResolvers = async (
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

    if (message.body === "!صلاحيات") {
      await getPermissionList(client, message);
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      return;
    }

    if (/^!صلاحيات/.test(message.body)) {
      await updatePermissions(client, message);
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      return;
    }
  } catch (error) {
    throw ErrorHandler(error, "permissionsResolvers");
  }
};

export default permissionsResolvers;
