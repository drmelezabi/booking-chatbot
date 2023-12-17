import WAWebJS from "whatsapp-web.js";
import RegisteredPhone from "../../../database/RegisteredPhone";
import isAdmin from "../../../controllers/rules/isAdmin";
import Chat from "../../../database/chat";
import updatePermissions from "./updatePermissions";
import getPermissionList from "./getPermissionsList";
import isSuperAdmin from "../../../controllers/rules/isSuperAdmin";

const permissionsResolvers = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
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

  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const date = new Intl.DateTimeFormat("ar-EG", optionsDate);

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
};

export default permissionsResolvers;
