import WAWebJS, { GroupChat } from "whatsapp-web.js";

import db from "../../database/setup";

export default async function bookingGroup(client: WAWebJS.Client) {
  const groupId = db.get<string>("groupId");

  const chats = await client.getChats();
  const groupChats = chats.filter((chat) => chat.isGroup);
  return groupChats.find(
    (chat) => chat.id._serialized === groupId
  ) as GroupChat;
}
