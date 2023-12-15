import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/rules/isAdmin";
import getRecovery from "../../controllers/accounts/get/getRecovery";

const generateRecovery = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  msg: string
) => {
  const { from: chatId } = message;
  // ---------------- Is Admin ----------------
  const errorMessage = await isAdmin(chatId);
  if (typeof errorMessage === "string") {
    await client.sendMessage(chatId, errorMessage);
    return;
  }
  // ------------------------------------------

  const messages = await getRecovery(msg);

  messages.map((message) => {
    client.sendMessage(chatId, message);
  });
};

export default generateRecovery;
