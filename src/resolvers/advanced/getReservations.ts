import WAWebJS from "whatsapp-web.js";

import reservationsTracking from "../../controllers/reservations/get/getReservations";
import isAdmin from "../../controllers/rules/isAdmin";

const getReservations = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const chatId = message.from;

  const errorMessage = await isAdmin(chatId);

  if (typeof errorMessage === "string")
    await client.sendMessage(chatId, errorMessage);

  const regex = new RegExp("^!متابع[ةه] ");
  const match = regex.exec(message.body);
  if (!match)
    await client.sendMessage(message.from, "🔍 عبارة متابعة غير صحيحة");

  const query = message.body.substring(match![0].length);

  await reservationsTracking(client, message, query);
};

export default getReservations;
