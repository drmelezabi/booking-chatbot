import WAWebJS from "whatsapp-web.js";

import bookingGroup from "./getGroup";

export default async function invitationLink(client: WAWebJS.Client) {
  const groupChat = await bookingGroup(client);
  const invitationCode = await groupChat.getInviteCode();
  return `https://chat.whatsapp.com/${invitationCode}`;
}
