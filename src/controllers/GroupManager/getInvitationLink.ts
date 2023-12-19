import WAWebJS from "whatsapp-web.js";

import bookingGroup from "./getGroup";
import ErrorHandler from "../../config/errorhandler";

export default async function invitationLink(client: WAWebJS.Client) {
  try {
    const groupChat = await bookingGroup(client);
    const invitationCode = await groupChat.getInviteCode();
    return `https://chat.whatsapp.com/${invitationCode}`;
  } catch (error) {
    throw ErrorHandler(error, "invitationLink");
  }
}
