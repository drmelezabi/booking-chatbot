import WAWebJS from "whatsapp-web.js";
import getAccountByChatId from "../../controllers/accounts/getStudentByChatId";
import { convertArToEnDigits as ArToEnNum } from "../../config/diff";
import hostAvail from "./Host";
import colleagueAvail from "./colleague";
import teacherAvail from "./teacher";

const avail = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  const registeredData = await getAccountByChatId(message.from);
  if (registeredData === null) {
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
  } else if (registeredData.type === "teacher" || registeredData.admin) {
    await teacherAvail(client, message, registeredData, str);
  } else {
    client.sendMessage(message.from, "❌ لا تملك صلاحية التنشيط");
  }
};

export default avail;
