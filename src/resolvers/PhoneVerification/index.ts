import WAWebJS from "whatsapp-web.js";
import getStudentIdByPass from "../../controllers/accounts/getStudentPass";

const phoneVerification = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const match = message.body.match(/^رمز\s*(\d+)$/);
  if (!match) return "رمز غير صالح";
  const accountId = await getStudentIdByPass(match[1]);
  const chatId = message.from;
  const messageBody = `الرقم الخاص بك هو ${accountId} و رقم المراسلة هو ${chatId}`;

  await client.sendMessage(chatId, messageBody);
};

export default phoneVerification;
