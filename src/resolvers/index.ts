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
import isAdmin from "../controllers/accounts/isAdmin";
import getReservations from "./advanced/getReservations";
import mySchedule from "./personal/mySchedule";
import myViolations from "./personal/myViolations";
import { convertArToEnDigits } from "../config/diff";
import addNewAppointment from "./booking/addNewAppointment";

const router = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  if (/^مساعد[ةه]\s*$/.test(message.body)) {
    await menu(client, message);
    //
  } else if (message.body === "توثيق") {
    await verification(client, message);
    //
  } else if (/^رمز\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/.test(message.body)) {
    let msg: string = convertArToEnDigits(message.body);
    await phoneVerification(client, message, msg);
    //
  } else if (/^[إأا]دار[ةه] المنظوم[ةه]\s*$/.test(message.body)) {
    // إداة المنظومة
    const errorMessage = await isAdmin(message.from);
    if (typeof errorMessage === "string")
      client.sendMessage(message.from, errorMessage);
    else await AdvancedMenu(client, message);
    //
  } else if (/^متابع[ةه]\s*$/.test(message.body)) {
    // متابعة
    const errorMessage = await isAdmin(message.from);
    if (typeof errorMessage === "string")
      client.sendMessage(message.from, errorMessage);
    else await trackingInfo(client, message);
    //
  } else if (/^طلب رمز استعاد[ةه]\s*$/.test(message.body)) {
    // طلب رمز استعادة
    const errorMessage = await isAdmin(message.from);
    if (typeof errorMessage === "string")
      client.sendMessage(message.from, errorMessage);
    else await getRec(client, message);
    //
  } else if (
    /^رمز [إا]ستعاد[هة]\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/.test(
      // رمز استعادة
      message.body
    )
  ) {
    let msg: string = convertArToEnDigits(message.body);
    await getRecovery(client, message, msg);
    //
  } else if (/^!متابع[ةه]\s/.test(message.body)) {
    // متابعة
    await getReservations(client, message);
  } else if (/^مواعيد[ىي]\s*$/.test(message.body)) {
    // مواعيدي
    await mySchedule(client, message);
  } else if (/^ملف[ىي]\s*$/.test(message.body)) {
    // ملفي
    await personalInfo(client, message);
  } else if (message.body === "!مخالفات") {
    await myViolations(client, message);
  } else if (/^!حجز\s/.test(message.body)) {
    await addNewAppointment(client, message);
  } else {
    client.sendMessage(
      message.from,
      `لا أفهم ما تحاول قوله يمكنك كتابة "مساعدة" لتلقي معلومات حول كيفية الاستفادة من منظومة المذاكرة`
    );
  }
};
export default router;
