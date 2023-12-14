import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import bookingGroup from "./getGroup";

export default async function configGroup(client: WAWebJS.Client) {
  const groupChat = await bookingGroup(client);
  const describe = `منظومة المذاكرة والمتابعة\n Bot developed by PhD Mohamed El-Ezabi`;
  if (groupChat.description != describe) groupChat.setDescription(describe);
  if (!groupChat.isReadOnly) groupChat.setMessagesAdminsOnly(true);
  const sticker = MessageMedia.fromFilePath("./src/imgs/orchestra.png");
  groupChat.setPicture(sticker);
  return;
}
