import WAWebJS from "whatsapp-web.js";
import { getStudentWeekBooked } from "../../controllers/rooms/get/getStudentWeekBooked";
import RegisteredPhone from "../../database/RegisteredPhone";

const mySchedule = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  const isExist = RegisteredPhone.fetch(
    (account) => account.chatId === message.from
  );
  if (!isExist) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }
  const accountId = isExist.accountId;
  const reservations = await getStudentWeekBooked(accountId);

  if (reservations.length) {
    const title = `*⏳ مواعيد المذاكرة لهذا الأسبوع*\n`;
    const messages = reservations.map((reser) => {
      return `*اليـــــــوم* :  ${reser.Day}\n*التـــــاريخ* :  ${reser.Date}\n*القــــــاعة* :  ${reser.Room}\n*التوقيــت* :  ${reser.Time}\n*الطـالــب* :  ${reser.Student}\n*الحـــــــالة* :  ${reser.Case}`;
    });
    const join = `\n`;
    const finalMessage = `${title}${join}${messages.join(
      "\n--------------------\n"
    )}${`\n`}`;
    client.sendMessage(message.from, finalMessage);
  } else {
    client.sendMessage(
      message.from,
      `🟢 *لا يوجد أي حجز خلال الأسبوع حتى الآن*`
    );
  }
};

export default mySchedule;
