import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../../controllers/accounts/isAdmin";
import { cancelTodaysCloudReservations } from "../../../controllers/rooms/cancelTodaysCloudReservations";
import Reservation from "../../../database/reservation";
import { getRestOfToday } from "../../../controllers/date/getRestOfToday";
import stopBookingAvailability from "../../../controllers/rules/stopBookingAvailability";

const cancelRestOfDayReservations = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
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
        new Date(reservation.Date) >= start && new Date(reservation.Date) <= end
    );
    Reservation.save();
    stopBookingAvailability(end);
    const msg = "تم حذف كل المواعيد المحجوزة من هذه الساعة وحتى نهاية اليوم";
    client.sendMessage(chatId, msg);
    return;
  }
};

export default cancelRestOfDayReservations;
