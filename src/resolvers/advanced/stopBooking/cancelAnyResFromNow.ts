import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../../controllers/accounts/isAdmin";
import Reservation from "../../../database/reservation";
import { getRestOfToday } from "../../../controllers/date/getRestOfToday";
import stopBookingAvailability from "../../../controllers/rules/stopBookingAvailability";
import { cancelAllNextCloudReservations } from "../../../controllers/rooms/cancelAllNextCloudReservations";

const cancelAnyResFromNow = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const { from: chatId } = message;

  // ------------------------------------------

  const cloudCancelation = await cancelAllNextCloudReservations();
  if (!cloudCancelation) {
    client.sendMessage(chatId, "حدث خدأ ما رجاء التواصل مع الإدارة");
  }

  Reservation.remove((reservation) => new Date(reservation.Date) >= new Date());
  Reservation.save();
  stopBookingAvailability();

  const msg = "تم حذف كل المواعيد المحجوزة من هذه ولأجل غير مسمى";
  client.sendMessage(chatId, msg);
};

export default cancelAnyResFromNow;
