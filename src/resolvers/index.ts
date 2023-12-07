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
const router = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
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
  else {
    const msg = `لا أفهم ما تحاول قوله يمكنك كتابة "مساعدة" لتلقي معلومات حول كيفية الاستفادة من منظومة المذاكرة`;
    client.sendMessage(from, msg);
  }
};
export default router;
