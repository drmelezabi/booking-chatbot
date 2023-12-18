import WAWebJS from "whatsapp-web.js";

import { convertArToEnDigits as ArToEnNum, enToAr } from "../config/diff";
import chat from "../controllers/chat";
import RegisteredPhone from "../database/RegisteredPhone";
import EditBookingRules from "../resolvers/advanced/EditBookingRules";
import getRecovery from "../resolvers/advanced/getRecovery";
import getReservations from "../resolvers/advanced/getReservations";
import permissionsResolvers from "../resolvers/advanced/permissions.ts";
import reservationAvailabilityControl from "../resolvers/advanced/stopBooking";
import createBackUp from "../resolvers/backup/backup";
import restoreLocalDB from "../resolvers/backup/retore";
import addNewReservation from "../resolvers/booking/addNewReservation";
import deleteReservation from "../resolvers/booking/deleteReservation";
import { mainMenu } from "../resolvers/menu";
import mySchedule from "../resolvers/personal/mySchedule";
import myViolations from "../resolvers/personal/myViolations";
import phoneVerification from "../resolvers/PhoneVerification";
import avail from "../resolvers/replace";
import showRules from "../resolvers/rules/ShowRules";
import updateBlockedDatesResolve from "../resolvers/rules/updateBlockedDates";
import updateBlockedDaysResolve from "../resolvers/rules/updateBlockedDays";
import updateRoomsResolve from "../resolvers/rules/updateRooms";
import seed from "../resolvers/seed";
import verify from "../resolvers/verify";
import studentActive from "../resolvers/verify/active";

const router = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  const { body, from } = message;

  if (/^!توثيق\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/.test(body)) {
    await phoneVerification(client, message, ArToEnNum(body));
    return;
  }
  const checkChat = chat(client, message);

  const isRegisteredAccount = RegisteredPhone.fetch(
    (account) => account.chatId === from
  );

  if (!isRegisteredAccount) {
    client.sendMessage(from, `🛡 *أنت تستخدم هاتف خارج المنظومة* 🛡`);
    client.sendMessage(
      from,
      `📱 *لتوثيق رقم هاتفك* 📱\n\nأرسل 👈 *!توثيق* 👉 متبوعة بالرقم الشخصي\n*مثال*:\n!توثيق ${enToAr(
        "12345"
      )}`
    );
    return;
  }

  if (!checkChat) return;
  const { counter, data, taskSyntax } = checkChat;

  //
  if (/^!مساعد[ةه]\s*$/.test(body) || taskSyntax === "!مساعدة")
    await mainMenu(client, message, counter, isRegisteredAccount);
  //
  //
  else if (/^![إاأ]لغاء\s*$/.test(body))
    await deleteReservation(client, message);
  //
  //
  else if (body === "!تنشيط") await verify(client, message);
  //
  //
  else if (/^!تنشيط\s*$([0-9\u0660-\u0669\u06F0-\u06F9]+)$/.test(body))
    await studentActive(client, message, ArToEnNum(body));
  //
  //
  else if (/^!متابع[ةه]\s*\w*/.test(body))
    await getReservations(client, message);
  //
  //
  else if (
    /^![إأا]ستعاد[هة]\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)\s*$/.test(body)
  )
    await getRecovery(client, message, ArToEnNum(body));
  //
  //
  else if (/^!مواعيد[ىي]\s*$/.test(body)) await mySchedule(client, message);
  //
  //
  else if (/^!مخالفات\s*$/.test(body)) await myViolations(client, message);
  //
  //
  else if (/^!حجز\s*/.test(body)) await addNewReservation(client, message);
  //
  //
  else if (/^!تمرير\s*(\d+\s*)*/.test(body)) await avail(client, message);
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
    /^!حال[ةه] المنظوم[ةه]\s*$/.test(body) ||
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
    await restoreLocalDB(client, message, counter, data);
  //
  //
  else if (/^!بناء/.test(body) || taskSyntax === "!بناء")
    await seed(client, message, counter);
  //
  //
  else {
    const msg =
      "❓ **لست متأكد مما تقصده. اكتب** *!مساعدة* **للوصول إلى دليل استخدام منظومة المذاكرة** ❓";
    client.sendMessage(from, msg);
  }
};
export default router;
