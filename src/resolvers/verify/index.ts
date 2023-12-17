import WAWebJS from "whatsapp-web.js";
import getCloudAccount from "../../controllers/accounts/get/getStudent";
import studentVerify from "./studentVerify";
import supervisorVerify from "./supervisorVerify";
import RegisteredPhone from "../../database/RegisteredPhone";

const verify = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  const isExist = RegisteredPhone.get(
    (account) => account.chatId === message.from
  );

  if (!isExist) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  const studentId = isExist.accountId;

  const studentData = await getCloudAccount(studentId);

  if (!studentData) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  if (isExist.type === "student") {
    await studentVerify(client, message, isExist);
    return;
  }
  //
  else if (
    isExist.type === "teacher" ||
    ["admin", "superAdmin"].includes(isExist.permissions)
  ) {
    await supervisorVerify(client, message);
    return;
  }
  //
  client.sendMessage(
    message.from,
    `❌ لا ${isExist.gender === "male" ? "تمتلك" : "تمتلكين"} صلاحية التنشيط`
  );
  return;
};

export default verify;
