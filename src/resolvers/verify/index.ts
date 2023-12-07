import WAWebJS from "whatsapp-web.js";
import getAccountByChatId from "../../controllers/accounts/getStudentByChatId";
import getStudentViolations from "../../controllers/accounts/getStudentViolations";
import getStudent from "../../controllers/accounts/getStudent";
import studentVerify from "./studentVerify";
import supervisorVerify from "./supervisorVerify";

const verify = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  const isExist = await getAccountByChatId(message.from);
  if (isExist === null) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  } else {
    const studentId = isExist!.studentId;

    // await getStudentViolations(rsstudentId);

    const studentData = await getStudent(studentId);

    if (!studentData) {
      client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
      return;
    } else {
      if (isExist.type === "student") {
        await studentVerify(client, message, isExist);
      } else if (isExist.type === "teacher" || isExist.admin === true) {
        await supervisorVerify(client, message, isExist);
      } else {
        client.sendMessage(message.from, "❌ لا تملك صلاحية التنشيط");
      }
    }
  }
};

export default verify;
