import WAWebJS, { GroupChat } from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import db from "../../database/setup";

export default async function bookingGroup(client: WAWebJS.Client) {
  try {
    const groupId = db.get<string>("groupId");

    const chats = await client.getChatById(groupId);
    return chats as GroupChat;
  } catch (error) {
    throw ErrorHandler(error, "bookingGroup");
  }
}
