import ErrorHandler from "../../../config/errorhandler";
import RegisteredPhone from "../../../database/RegisteredPhone";
import manipulatePhone from "../manipulatePhone";

const getRecovery = async (unformattedPhone: string) => {
  try {
    let phone: RegExpMatchArray | null;
    phone = unformattedPhone.match(
      /^![إا]ستعاد[هة]\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/
    );

    if (!phone) {
      phone = unformattedPhone
        .slice(1)
        .match(/^![إا]ستعاد[هة]\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/);

      if (!phone) return [];
    }

    const returnMessages: string[] = [];

    if (phone) {
      const preparePhone = manipulatePhone(phone[1]);

      const caseExist = RegisteredPhone.fetch(
        (caseData) => caseData.chatId === `${preparePhone}@c.us`
      );

      if (!caseExist) {
        returnMessages.push(`❗ أنت تستعلم عن هاتف غير موجود بالمنظومه أو تكتب رقم الهاتف بدون مفتاح الدولة
  مثال:
  مفتاح الهاتف لجمهورية مصر هو 20 و رقم الهتاف هو 1020202020
  في تلك الحالة يكون رقم الهاتف 201020202020`);
      } else {
        returnMessages.push(`🔑 رمز الاستعادة هو`);
        returnMessages.push(caseExist.recoveryId);
      }
    } else {
      returnMessages.push(`❗ رقم هاتف خاطئ
  رقم الهاتف لابد أن يكون بالمواصفات التالية
  مثال:
  مفتاح الهاتف لجمهورية مصر هو 20 و رقم الهتاف هو 1020202020
  في تلك الحالة يكون رقم الهاتف 201020202020`);
    }

    return returnMessages;
  } catch (error) {
    throw ErrorHandler(error, "getRecovery");
  }
};

export default getRecovery;
