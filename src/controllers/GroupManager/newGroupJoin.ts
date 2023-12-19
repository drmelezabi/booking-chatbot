import WAWebJS, { MessageMedia } from "whatsapp-web.js";

import bookingGroup from "./getGroup";
import ErrorHandler from "../../config/errorhandler";
import RegisteredPhone from "../../database/RegisteredPhone";
import db from "../../database/setup";

export default async function onJoin(
  notification: WAWebJS.GroupNotification,
  client: WAWebJS.Client
) {
  try {
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
      );

      if (!account) throw new Error("account should not be nullable");

      await group.sendMessage(
        `مرحبا ${account.name} في منظومة المذاكرة والمتابعة لقسم التربية الموسيقية\n @${account.contact.user}`,
        {
          mentions: [contact],
        }
      );
      const sticker = MessageMedia.fromFilePath("./src/imgs/welcome.png");
      await group.sendMessage(sticker);

      return;
    }
    return;
  } catch (error) {
    throw ErrorHandler(error, "onJoin");
  }
}
