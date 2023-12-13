import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/accounts/isAdmin";

const showRules = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  const chatId = message.from;
  // ---------------- Is Admin ----------------
  const errorMessage = await isAdmin(chatId);
  if (typeof errorMessage === "string") {
    await client.sendMessage(chatId, errorMessage);
    return;
  }
  // ------------------------------------------
};

export default showRules;
