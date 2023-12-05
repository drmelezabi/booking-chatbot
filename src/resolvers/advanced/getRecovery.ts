import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/accounts/isAdmin";
import getRecovery from "../../controllers/accounts/getRecovery";

const generateRecovery = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  msg: string
) => {
  const chatId = message.from;

  const errorMessage = await isAdmin(chatId);

  if (typeof errorMessage === "string")
    await client.sendMessage(chatId, errorMessage);

  const messages = await getRecovery(msg);

  messages.map((message) => {
    client.sendMessage(chatId, message);
  });
};

export default generateRecovery;