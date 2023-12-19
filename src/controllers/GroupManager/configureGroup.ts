import WAWebJS, { MessageMedia } from "whatsapp-web.js";

import bookingGroup from "./getGroup";
import ErrorHandler from "../../config/errorhandler";

export default async function configGroup(client: WAWebJS.Client) {
  try {
    const groupChat = await bookingGroup(client);
    const describe = `منظومة المذاكرة والمتابعة\n Bot developed by PhD Mohamed El-Ezabi`;
    if (
      typeof groupChat === "object" &&
      (!("description" in groupChat) ||
        ("description" in groupChat && groupChat.description != describe))
    ) {
      groupChat.setDescription(describe);
    }
    if (
      typeof groupChat === "object" &&
      (!("isReadOnly" in groupChat) ||
        ("isReadOnly" in groupChat && !groupChat.isReadOnly))
    ) {
      groupChat.setMessagesAdminsOnly(true);
    }
    const sticker = MessageMedia.fromFilePath("./src/imgs/orchestra.png");
    if (typeof groupChat === "object" && "setPicture" in groupChat) {
      groupChat.setPicture(sticker);
    }
    return;
  } catch (error) {
    throw ErrorHandler(error, "configGroup");
  }
}
