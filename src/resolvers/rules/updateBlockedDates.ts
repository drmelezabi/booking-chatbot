import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/accounts/isAdmin";
import updateBlockedDates from "../../controllers/rules/update/updateBlockedDay";
type blockedDates = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
import util from "util";

const updateBlockedDatesResolve = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const chatId = message.from;
  // ---------------- Is Admin ----------------
  const errorMessage = await isAdmin(chatId);
  if (typeof errorMessage === "string") {
    await client.sendMessage(chatId, errorMessage);
    return;
  }
  // ------------------------------------------

  const query = message.body
    .substring("!حجب تاريخ".length)
    .trim()
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, " ");

  const table = query.split(" ");
  const hehe = await client.sendMessage(chatId, "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀");

  const chat = await client.getChatById(chatId);
  const messages = await chat.fetchMessages({ limit: 6, fromMe: true });

  console.log(util.inspect(messages, { depth: 2, colors: true }));
};

export default updateBlockedDatesResolve;
