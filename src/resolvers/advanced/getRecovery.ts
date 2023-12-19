import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import getRecovery from "../../controllers/accounts/get/getRecovery";
import isAdmin from "../../controllers/rules/isAdmin";

const generateRecovery = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  msg: string
) => {
  try {
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
  } catch (error) {
    throw ErrorHandler(error, "generateRecovery");
  }
};

export default generateRecovery;
