import WAWebJS from "whatsapp-web.js";
import getAccountByChatId from "../../controllers/accounts/getStudentByChatId";
import getStudentViolations from "../../controllers/accounts/getStudentViolations";
import getStudent from "../../controllers/accounts/getStudent";

function countValues(arr: string[]): string {
  const countMap: { [key: string]: number } = {};

  // Count occurrences of each element in the array
  arr.forEach((item) => {
    if (countMap[item]) {
      countMap[item]++;
    } else {
      countMap[item] = 1;
    }
  });

  // Generate the output string
  let result = "*المخالفات المرتكبة حتى الآن*\n";
  for (const key in countMap) {
    result += `⛔ ${key} : ${countMap[key]}\n`;
  }

  return result;
}

const myViolations = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const isExist = await getAccountByChatId(message.from);
  if (isExist === null) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  } else {
    const studentId = isExist!.studentId;

    await getStudentViolations(studentId);

    const studentData = await getStudent(studentId);

    if (!studentData) {
      client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
      return;
    } else {
      if (!studentData.violations.length) {
        client.sendMessage(
          message.from,
          "✔ لم ترتكب أي مخالفات حتى الآن أحسنت"
        );
      } else {
        client.sendMessage(message.from, countValues(studentData.violations));
      }
    }
  }
};

export default myViolations;
