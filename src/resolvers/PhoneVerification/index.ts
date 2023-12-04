import WAWebJS from "whatsapp-web.js";
import getStudentIdByPass from "../../controllers/accounts/getStudentPass";
import createRegisteredPhone from "../../controllers/accounts/createRegisteredPhone";
import { recoveryCodeGen } from "../../config/IDs";
import { updateCloudAccount } from "../../controllers/accounts/updateCloudAccount";
import checkRegisteredPhoneByRecoveryId from "../../controllers/rules/getRegisteredPhone";
import checkRegisteredPhoneExistedPhone from "../../controllers/accounts/checkRegisteredPhoneExistedPhone";
import updateRegisteredPhone from "../../controllers/rules/updateRegisteredPhone";

const phoneVerification = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const match = message.body.match(/^رمز\s*(\d+)$/);
  const chatId = message.from;
  if (!match) {
    await client.sendMessage(chatId, "رمز غير صالح");
  } else {
    const accountData = await getStudentIdByPass(match[1]);
    if (!accountData) {
      await client.sendMessage(chatId, "رمز غير صالح");
    } else {
      const recoveryCode = recoveryCodeGen();

      const IsActivated = await checkRegisteredPhoneByRecoveryId(match[1]);

      if (!IsActivated) {
        await createRegisteredPhone({
          studentId: accountData.id,
          chatId: chatId,
          admin: accountData.data.admin,
          type: accountData.data.type,
          recoveryId: recoveryCode,
        });
        await updateCloudAccount(accountData.id, {
          whatsappId: chatId,
          pass: recoveryCode,
        });
        const firstMessageBody = `✨✨شكرا ${accountData.data.name} على توثيق هاتفك الآن يمكنك الاستفادة من منظومة المذاكرة`;
        const secondMessageBody = `🔑 يرجى الاحتفاظ بهذا الرمز لضمان أمان حسابك`;
        await client.sendMessage(chatId, firstMessageBody);
        await client.sendMessage(chatId, secondMessageBody);
        await client.sendMessage(chatId, recoveryCode);
      } else {
        if (IsActivated.chatId === chatId)
          await client.sendMessage(chatId, "الحساب موثق بالفعل");
        else if (await checkRegisteredPhoneExistedPhone(chatId)) {
          await client.sendMessage(chatId, "الهاتف موثق من قبل حساب آخر");
        } else {
          await updateRegisteredPhone(accountData.id, {
            chatId: chatId,
            admin: accountData.data.admin,
            type: accountData.data.type,
            recoveryId: recoveryCode,
          });

          await updateCloudAccount(accountData.id, {
            whatsappId: chatId,
            pass: recoveryCode,
          });
          const firstMessageBody = `✨✨شكرا ${accountData.data.name} على توثيق هاتفك الآن يمكنك الاستفادة من منظومة المذاكرة`;
          const secondMessageBody = `🔑 يرجى الاحتفاظ بهذا الرمز لضمان أمان حسابك`;
          await client.sendMessage(chatId, firstMessageBody);
          await client.sendMessage(chatId, secondMessageBody);
          await client.sendMessage(chatId, recoveryCode);
        }
      }
    }
  }
};

export default phoneVerification;
