import WAWebJS, { MessageMedia } from "whatsapp-web.js";
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
    console.log({ contact, memberChatId });
    const account = RegisteredPhone.fetch(
      (account) => account.chatId === memberChatId
    )!;
    await group.sendMessage(
      `مرحبا ${account.name} في منظومة المذاكرة والمتابعة لقسم التربية الموسيقية\n @${account.contact.user}`,
      {
        mentions: [contact],
      }
    );
    const sticker = MessageMedia.fromFilePath("./src/imgs/rejected.png");
    await group.sendMessage(sticker);

    return;
  }
  return;
}
