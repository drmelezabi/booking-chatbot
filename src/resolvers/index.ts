import WAWebJS from "whatsapp-web.js";
import {
  menu,
  verification,
  AdvancedMenu,
  getRec,
  trackingInfo,
  personalInfo,
} from "./menu";
import phoneVerification from "./PhoneVerification";
import getRecovery from "./advanced/getRecovery";
import getReservations from "./advanced/getReservations";
import mySchedule from "./personal/mySchedule";
import myViolations from "./personal/myViolations";
import { convertArToEnDigits as ArToEnNum } from "../config/diff";
import addNewAppointment from "./booking/addNewAppointment";
import verify from "./verify";
import studentActive from "./verify/active";
import deleteAppointment from "./booking/deleteAppointment";
import avail from "./replace";
import localDb from "../config/localDb";
import updateBlockedDaysResolve from "./rules/updateBlockedDays";
import getChatData from "../controllers/chat/getChatData";
import getAccountByChatId from "../controllers/accounts/getStudentByChatId";
import deleteChatData from "../controllers/chat/deleteChatData";
import updateBlockedDatesResolve from "./rules/updateBlockedDates";
const router = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  let counter = 0;
  let data: { [key: string]: unknown } = {};
  let lastMessage: Date = new Date();
  let taskSyntax: string = "";
  let accountId: string = "";

  if (!message.body.startsWith("!")) {
    const chat = await getChatData(accountId);
    const isExist = await getAccountByChatId(message.from);
    if (isExist) accountId = isExist.studentId;
    const oneMinutes = 1 * 60 * 1000;

    if (new Date() > new Date(new Date(lastMessage).getTime() + oneMinutes)) {
      if (chat) taskSyntax = chat[accountId].taskSyntax;
      await deleteChatData(accountId);
    } else if (chat) {
      counter = chat[accountId].counter;
      data = chat[accountId].data;
      lastMessage = chat[accountId].lastMessage;
      taskSyntax = chat[accountId].taskSyntax;
    }
  } else {
    await deleteChatData(accountId);
  }

  const { body, from } = message;
  //
  if (/^!مساعد[ةه]\s*$/.test(body)) await menu(client, message);
  //
  //
  else if (body === "!توثيق") await verification(client, message);
  //
  //
  else if (/^![إاأ]لغاء\s*$/.test(body))
    await deleteAppointment(client, message);
  //
  //
  else if (/^!توثيق\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/.test(body))
    await phoneVerification(client, message, ArToEnNum(body));
  //
  //
  else if (body === "!تنشيط") await verify(client, message);
  //
  //
  else if (/^!تنشيط\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/.test(body))
    await studentActive(client, message, ArToEnNum(body));
  //
  //
  else if (/^!متابع[ةه]\s/.test(body)) await getReservations(client, message);
  //
  //
  else if (/^!متابع[ةه]\s*$/.test(body)) await trackingInfo(client, message);
  //
  //
  else if (/^![إأا]ستعاد[هة]\s*$/.test(body)) await getRec(client, message);
  //
  //
  else if (/^![إأا]ستعاد[هة]\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/.test(body))
    await getRecovery(client, message, ArToEnNum(body));
  //
  //
  else if (/^!مواعيد[ىي]\s*$/.test(body)) await mySchedule(client, message);
  //
  //
  else if (/^!ملف[ىي]\s*$/.test(body)) await personalInfo(client, message);
  //
  //
  else if (body === "!مخالفات") await myViolations(client, message);
  //
  //
  else if (/^!حجز\s/.test(body)) await addNewAppointment(client, message);
  //
  //
  else if (/^![إأا]دار[ةه]\s*$/.test(body)) await AdvancedMenu(client, message);
  //
  //
  else if (/^!تمرير\s*(\d+\s*)*$/.test(body)) await avail(client, message);
  //
  //
  else if (body === "!حجب تاريخ" || taskSyntax === "!حجب تاريخ")
    await updateBlockedDatesResolve(client, message, counter, data);
  //
  //
  else if (/^!حجب/i.test(body)) await updateBlockedDaysResolve(client, message);
  //
  //
  else {
    const msg = `لا أفهم ما تحاول قوله يمكنك كتابة "مساعدة" لتلقي معلومات حول كيفية الاستفادة من منظومة المذاكرة`;
    client.sendMessage(from, msg);
  }
  await localDb.reload();
};
export default router;
