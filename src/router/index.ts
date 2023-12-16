import WAWebJS from "whatsapp-web.js";
import {
  menu,
  verification,
  AdvancedMenu,
  getRec,
  trackingInfo,
  personalInfo,
} from "../resolvers/menu";
import phoneVerification from "../resolvers/PhoneVerification";
import getRecovery from "../resolvers/advanced/getRecovery";
import getReservations from "../resolvers/advanced/getReservations";
import mySchedule from "../resolvers/personal/mySchedule";
import myViolations from "../resolvers/personal/myViolations";
import { convertArToEnDigits as ArToEnNum } from "../config/diff";
import addNewReservation from "../resolvers/booking/addNewReservation";
import verify from "../resolvers/verify";
import studentActive from "../resolvers/verify/active";
import deleteReservation from "../resolvers/booking/deleteReservation";
import avail from "../resolvers/replace";
import updateBlockedDaysResolve from "../resolvers/rules/updateBlockedDays";
import updateBlockedDatesResolve from "../resolvers/rules/updateBlockedDates";
import showRules from "../resolvers/rules/ShowRules";
import reservationAvailabilityControl from "../resolvers/advanced/stopBooking";
import updateRoomsResolve from "../resolvers/rules/updateRooms";
import EditBookingRules from "../resolvers/advanced/EditBookingRules";
import permissionsResolvers from "../resolvers/advanced/permissions.ts";
import chat from "../controllers/chat";
import createBackUp from "../resolvers/backup/backup";
import restoreLocalDB from "../resolvers/backup/restore";

const router = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  const checkChat = chat(client, message);
  if (!checkChat) return;
  const { counter, data, taskSyntax } = checkChat;

  const { body, from } = message;
  //
  if (/^!مساعد[ةه]\s*$/.test(body)) await menu(client, message);
  //
  //
  else if (body === "!توثيق") await verification(client, message);
  //
  //
  else if (/^![إاأ]لغاء\s*$/.test(body))
    await deleteReservation(client, message);
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
  else if (/^!حجز\s/.test(body)) await addNewReservation(client, message);
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
  else if (/^!غرف/i.test(body)) await updateRoomsResolve(client, message);
  //
  //
  else if (/^!عرض القواعد/.test(body)) await showRules(client, message);
  //
  //
  else if (/^!قواعد الحجز/.test(body) || taskSyntax === "!قواعد الحجز")
    await EditBookingRules(client, message, counter);
  //
  //
  else if (/^!صلاحيات/.test(message.body)) {
    await permissionsResolvers(client, message);
  }
  //
  //
  else if (
    /^!حال[ةه] المنظوم[ةه]/.test(body) ||
    taskSyntax === "!حالة المنظومة"
  )
    await reservationAvailabilityControl(client, message, counter, data);
  //
  //
  else if (
    /^!نسخ[ةه] [إأا]حتياطي[ةه]/.test(body) ||
    taskSyntax === "!نسخة احتياطية"
  )
    await createBackUp(client, message, counter);
  //
  //
  else if (/^!استعاد[ةه] نسخ[ةه]/.test(body) || taskSyntax === "!استعادة نسخة")
    await restoreLocalDB(client, message, counter);
  //
  //
  else {
    const msg = `لا أفهم ما تحاول قوله يمكنك كتابة "مساعدة" لتلقي معلومات حول كيفية الاستفادة من منظومة المذاكرة`;
    client.sendMessage(from, msg);
  }
};
export default router;
