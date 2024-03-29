import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import { getStudentWeekBooked } from "../../controllers/rooms/get/getStudentWeekBooked";
import RegisteredPhone from "../../database/RegisteredPhone";

const mySchedule = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  try {
    const isExist = RegisteredPhone.fetch(
      (account) => account.chatId === message.from
    );
    if (!isExist) {
      client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
      return;
    }
    const accountId = isExist.accountId;
    const reservations = await getStudentWeekBooked(accountId);
    const account = await RegisteredPhone.fetch(
      (acc) => acc.accountId === accountId
    );

    if (!account) throw new Error("account should not be nullable");

    if (account.type !== "student") {
      client.sendMessage(
        message.from,
        "❌ الطالب فقط من يمتك إمكانية استخدام هذه الميزة"
      );
      return;
    }

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
  } catch (error) {
    throw ErrorHandler(error, "mySchedule");
  }
};

export default mySchedule;
