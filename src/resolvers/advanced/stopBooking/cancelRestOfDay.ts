import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../../config/errorhandler";
import { getRestOfToday } from "../../../controllers/date/getRestOfToday";
import bookingGroup from "../../../controllers/GroupManager/getGroup";
import { cancelTodaysCloudReservations } from "../../../controllers/reservations/cancel/cancelTodaysCloudReservations";
import stopBookingAvailability from "../../../controllers/rules/stopBookingAvailability";
import Reservation from "../../../database/reservation";

const cancelRestOfDayReservations = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  try {
    const { from: chatId } = message;
    // ------------------------------------------

    const cloudCancelation = await cancelTodaysCloudReservations();
    if (!cloudCancelation) {
      client.sendMessage(chatId, "حدث خدأ ما رجاء التواصل مع الإدارة");
    }
    const RestOfToday = getRestOfToday();
    if (!RestOfToday) {
      const msg = "اليوم منتهي بالفعل";
      client.sendMessage(chatId, msg);
      return;
    } else {
      const { start, end } = RestOfToday;
      Reservation.remove(
        (reservation) =>
          new Date(reservation.Date) >= start &&
          new Date(reservation.Date) <= end
      );
      Reservation.save();
      stopBookingAvailability(end);
      const msg = "تم حذف كل المواعيد المحجوزة من هذه الساعة وحتى نهاية اليوم";
      client.sendMessage(chatId, msg);
      const group = await bookingGroup(client);
      group.sendMessage(
        "تم تعليق المذاكرة حتى نهاية اليوم وتم إلغاء كافة المواعيد المحجوزة ولن تحتسب أية مخالفات على المواعيد الملغاة"
      );
      return;
    }
  } catch (error) {
    throw ErrorHandler(error, "cancelRestOfDayReservations");
  }
};

export default cancelRestOfDayReservations;
