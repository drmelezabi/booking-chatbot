import WAWebJS from "whatsapp-web.js";
import getAccountByChatId from "../../controllers/accounts/getStudentByChatId";
import { getStudentWeekBooked } from "../../controllers/rooms/getStudentWeekBooked";

const addNewAppointment = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const isExist = await getAccountByChatId(message.from);
  if (isExist === null)
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
  const studentId = isExist!.studentId;
  const reservations = await getStudentWeekBooked(studentId);

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

export default addNewAppointment;
