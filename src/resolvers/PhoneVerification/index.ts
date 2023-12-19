import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import { recoveryCodeGen } from "../../config/IDs";
import getCloudStudentIdByPass from "../../controllers/accounts/get/getStudentPass";
import { updateCloudAccount } from "../../controllers/accounts/update/updateCloudAccount";
import invitationLink from "../../controllers/GroupManager/getInvitationLink";
import RegisteredPhone from "../../database/RegisteredPhone";

const phoneVerification = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  msg: string
) => {
  try {
    const match = msg.match(/^!توثيق\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/);
    const chatId = message.from;
    if (!match) {
      await client.sendMessage(chatId, "رمز غير صالح");
      return;
    }

    const accountData = await getCloudStudentIdByPass(match[1]);

    if (!accountData) {
      await client.sendMessage(chatId, "رمز غير صالح");
      return;
    }

    const recoveryCode = recoveryCodeGen();
    const IsActivated = RegisteredPhone.fetch(
      (account) => account.recoveryId === match[1]
    );
    const contactData = (await message.getContact()).id;

    if (!IsActivated) {
      RegisteredPhone.create({
        accountId: accountData.id,
        name: accountData.data.name,
        fullName: accountData.data.fullName,
        chatId: chatId,
        gender: accountData.data.gender,
        permissions: accountData.data.permissions,
        type: accountData.data.type,
        recoveryId: recoveryCode,
        contact: contactData,
      });
      RegisteredPhone.save();

      await updateCloudAccount(accountData.id, {
        whatsappId: chatId,
        pass: recoveryCode,
      });

      const firstMessageBody = `✨✨شكرا ${accountData.data.name} على توثيق هاتفك الآن يمكنك الاستفادة من منظومة المذاكرة`;
      const secondMessageBody = `🔑 يرجى الاحتفاظ بهذا الرمز لضمان أمان حسابك`;
      await client.sendMessage(chatId, firstMessageBody);
      await client.sendMessage(chatId, secondMessageBody);
      await client.sendMessage(chatId, recoveryCode);

      const invitationURL = await invitationLink(client);
      const invitationMsg = `تستطيع الأن الانضمام إلى المجموعة لمتابعة كل الإشعارات الهامة\n\n ${invitationURL}`;
      await client.sendMessage(chatId, invitationMsg);

      return;
    }

    if (IsActivated.chatId === chatId) {
      await client.sendMessage(chatId, "الحساب موثق بالفعل");
      return;
    }

    if (RegisteredPhone.has((account) => account.chatId === chatId)) {
      await client.sendMessage(chatId, "الهاتف موثق من قبل حساب آخر");
      return;
    }

    RegisteredPhone.update((account) => {
      if (account.accountId === accountData.id) {
        account.chatId = chatId;
        account.permissions = accountData.data.permissions;
        account.gender = accountData.data.gender;
        account.fullName = accountData.data.fullName;
        account.name = accountData.data.name;
        account.type = accountData.data.type;
        account.recoveryId = recoveryCode;
        account.contact = contactData;
      }
    });
    RegisteredPhone.save();

    await updateCloudAccount(accountData.id, {
      whatsappId: chatId,
      pass: recoveryCode,
    });

    const firstMessageBody = `✨✨شكرا ${accountData.data.name} على توثيق هاتفك الآن يمكنك الاستفادة من منظومة المذاكرة`;
    const secondMessageBody = `🔑 يرجى الاحتفاظ بهذا الرمز لضمان أمان حسابك`;
    await client.sendMessage(chatId, firstMessageBody);
    await client.sendMessage(chatId, secondMessageBody);
    await client.sendMessage(chatId, recoveryCode);

    const invitationURL = await invitationLink(client);
    const invitationMsg = `تستطيع الأن الانضمام إلى المجموعة لمتابعة كل الإشعارات الهامة\n\n ${invitationURL}`;
    await client.sendMessage(chatId, invitationMsg);
    return;
  } catch (error) {
    throw ErrorHandler(error, "phoneVerification");
  }
};

export default phoneVerification;
