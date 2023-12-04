import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/accounts/isAdmin";
import reservationsTracking from "../../controllers/accounts/getReservations";

const getReservations = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const chatId = message.from;

  const errorMessage = await isAdmin(chatId);

  if (typeof errorMessage === "string")
    await client.sendMessage(chatId, errorMessage);

  const regex = new RegExp("^!متابعه ");
  const match = regex.exec(message.body);
  if (!match)
    await client.sendMessage(message.from, "🔍 عبارة متابعة غير صحيحة");

  const query = message.body.substring(match![0].length);

  //   const messages =
  await reservationsTracking(client, message, query);

  //   messages.map((message) => {
  //     client.sendMessage(chatId, message);
  //   });
};

export default getReservations;
