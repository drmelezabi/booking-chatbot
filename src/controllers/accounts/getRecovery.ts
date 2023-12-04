import checkRegisteredPhones from "../rules/getRegisteredPhones";
import manipulatePhone from "./manipulatePhone";

const getRecovery = async (unformattedPhone: string) => {
  let phone: RegExpMatchArray;
  phone = unformattedPhone.match(/^رمز استعاده\s*(\d+)$/)!;

  if (!phone) phone = unformattedPhone.slice(1).match(/^رمز استعاده\s*(\d+)$/)!;

  const returnMessages: string[] = [];

  if (phone) {
    const preparePhone = manipulatePhone(phone[1]);

    const registeredPhones = await checkRegisteredPhones();

    const caseExist = registeredPhones.filter(
      (caseData) => caseData.chatId === `${preparePhone}@c.us`
    );

    if (!caseExist.length) {
      returnMessages.push(`❗ أنت تستعلم عن هاتف غير موجود بالمنظومه أو تكتب رقم الهاتف بدون مفتاح الدولة
مثال:
مفتاح الهاتف لجمهورية مصر هو 20 و رقم الهتاف هو 1020202020
في تلك الحالة يكون رقم الهاتف 201020202020`);
    } else {
      returnMessages.push(`🔑 رمز الاستعادة هو`);
      returnMessages.push(caseExist[0].recoveryId);
    }
  } else {
    returnMessages.push(`❗ رقم هاتف خاطئ
رقم الهاتف لابد أن يكون بالمواصفات التالية
مثال:
مفتاح الهاتف لجمهورية مصر هو 20 و رقم الهتاف هو 1020202020
في تلك الحالة يكون رقم الهاتف 201020202020`);
  }

  return returnMessages;
};

export default getRecovery;
