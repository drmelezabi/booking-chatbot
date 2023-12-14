import WAWebJS from "whatsapp-web.js";
import db from "../../database/setup";
import bookingGroup from "./getGroup";
import RegisteredPhone from "../../database/RegisteredPhone";

export default async function onJoin(
  notification: WAWebJS.GroupNotification,
  client: WAWebJS.Client
) {
  const groupId = db.get<string>("groupId");

  if (
    notification.chatId === groupId &&
    "participant" in notification.id &&
    typeof notification.id.participant === "string"
  ) {
    const memberChatId = notification.id.participant;
    const group = await bookingGroup(client);

    const isExist = RegisteredPhone.fetch(
      (account) => account.chatId === memberChatId
    );

    if (!isExist) {
      const msgToContactWhoJoined =
        "❌ انت تستخدم هاتف خارج المنظومه لا يمكنك الانضمام إلى المجموعة";
      client.sendMessage(memberChatId, msgToContactWhoJoined);
      group.removeParticipants([memberChatId]);
      return;
    }

    const contact = await client.getContactById(memberChatId);
    const account = RegisteredPhone.fetch(
      (account) => account.chatId === memberChatId
    )!;
    group.sendMessage(`مرحبا ${account.name}`, { mentions: [contact] });
    return;
  }
  return;
}
