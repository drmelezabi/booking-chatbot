import WAWebJS from "whatsapp-web.js";
import getStudentViolations from "../../controllers/accounts/get/getStudentViolations";
import getCloudAccount from "../../controllers/accounts/get/getStudent";
import RegisteredPhone from "../../database/RegisteredPhone";

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
  const isExist = RegisteredPhone.get(
    (account) => account.chatId === message.from
  );

  if (!isExist) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  const accountId = isExist.accountId;

  await getStudentViolations(accountId);

  const studentData = await getCloudAccount(accountId);

  if (!studentData) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  if (!studentData.violations.length) {
    client.sendMessage(
      message.from,
      `✔ لم ${
        isExist.gender === "male" ? "تقم" : "تقومي بارتكاب"
      } أي مخالفات حتى الآن أحسنت`
    );
    return;
  }

  client.sendMessage(message.from, countValues(studentData.violations));
  return;
};

export default myViolations;
