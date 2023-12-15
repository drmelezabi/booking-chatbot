import WAWebJS from "whatsapp-web.js";
import { convertArToEnDigits as ArToEnNum } from "../../config/diff";
import hostAvail from "./Host";
import colleagueAvail from "./colleague";
import teacherAvail from "./teacher";
import RegisteredPhone from "../../database/RegisteredPhone";

const avail = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  const registeredData = RegisteredPhone.fetch(
    (account) => account.chatId === message.from
  );
  if (!registeredData) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  const str = ArToEnNum(message.body);

  if (registeredData.type === "student") {
    if (str.trim() === "!تمرير") {
      await hostAvail(client, message, registeredData);
    } else {
      await colleagueAvail(client, message, registeredData, str);
    }
  } else if (registeredData.type === "teacher" || registeredData.permissions) {
    await teacherAvail(client, message, registeredData, str);
  } else {
    client.sendMessage(
      message.from,
      `❌ لا ${
        registeredData.gender === "male" ? "تمتلك" : "تمتلكين"
      } صلاحية التنشيط`
    );
  }
};

export default avail;
