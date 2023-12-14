import WAWebJS from "whatsapp-web.js";
import getCloudStudentIdByPass from "../../controllers/accounts/getStudentPass";
import { recoveryCodeGen } from "../../config/IDs";
import { updateCloudAccount } from "../../controllers/accounts/updateCloudAccount";
import RegisteredPhone from "../../database/RegisteredPhone";
import invitationLink from "../../controllers/GroupManager/getInvitationLink";
import bookingGroup from "../../controllers/GroupManager/getGroup";

const phoneVerification = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  msg: string
) => {
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

  if (!IsActivated) {
    RegisteredPhone.create({
      accountId: accountData.id,
      name: accountData.data.name,
      chatId: chatId,
      admin: accountData.data.admin,
      type: accountData.data.type,
      recoveryId: recoveryCode,
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
      account.admin = accountData.data.admin;
      account.type = accountData.data.type;
      account.recoveryId = recoveryCode;
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
  const invitationMsg = `نرجو الانضمام إلى الجموعة التالية لمتابعة كل الإشعارات المهمة\n\n ${invitationURL}`;
  await client.sendMessage(chatId, invitationMsg);
  return;
};

export default phoneVerification;
