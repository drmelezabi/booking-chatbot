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
import updateBlockedDaysResolve from "./rules/updateBlockedDays";
import updateBlockedDatesResolve from "./rules/updateBlockedDates";
import Chat from "../database/chat";
import showRules from "./rules/ShowRules";
import RegisteredPhone from "../database/RegisteredPhone";
import reservationAvailabilityControl from "./advanced/stopBooking";
import updateRoomsResolve from "./rules/updateRooms";
import EditBookingRules from "./advanced/EditBookingRules";
import permissionsResolvers from "./advanced/permissions.ts";

const remove = (accountId: string) => {
  const length = Chat.fetchMany((c) => c.id === accountId).length;
  for (let index = 0; index < length; index++) {
    Chat.remove((c) => c.id === accountId);
    Chat.save();
  }
};

const router = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  let counter = 0;
  let data: { [key: string]: unknown } = {};
  let lastMessage: Date = new Date();
  let taskSyntax: string = "";
  let accountId: string = "";

  if (message.body.startsWith("!")) {
    const isExist = RegisteredPhone.fetch(
      (account) => account.chatId === message.from
    );
    Chat.save();
    if (isExist) {
      accountId = isExist.accountId;
      remove(accountId);
    }
  } else {
    const isExist = RegisteredPhone.fetch(
      (account) => account.chatId === message.from
    );
    Chat.save();
    if (isExist) accountId = isExist.accountId;
    const chanData = Chat.fetch((u) => u.id === accountId);
    Chat.save();
    if (/^[إآأا]لغاء/.test(message.body)) {
      if (chanData) {
        remove(accountId);
        const msg = `تم الإلغاء`;
        client.sendMessage(message.from, msg);
        return;
      }
    } else {
      const oneMinutes = 1 * 60 * 1000;
      if (chanData) {
        if (
          new Date() > new Date(new Date(lastMessage).getTime() + oneMinutes)
        ) {
          if (chanData) taskSyntax = chanData.taskSyntax;
          remove(accountId);
        } else {
          counter = chanData.counter;
          data = chanData.data;
          lastMessage = chanData.lastMessage;
          taskSyntax = chanData.taskSyntax;
        }
      }
    }
  }

  Chat.save();

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
  else {
    const msg = `لا أفهم ما تحاول قوله يمكنك كتابة "مساعدة" لتلقي معلومات حول كيفية الاستفادة من منظومة المذاكرة`;
    client.sendMessage(from, msg);
  }
};
export default router;
