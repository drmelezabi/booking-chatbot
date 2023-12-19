import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../../config/errorhandler";
import bookingGroup from "../../../controllers/GroupManager/getGroup";
import { cancelAllNextCloudReservations } from "../../../controllers/reservations/cancel/cancelAllNextCloudReservations";
import stopBookingAvailability from "../../../controllers/rules/stopBookingAvailability";
import Reservation from "../../../database/reservation";

const cancelAnyResFromNow = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  try {
    const { from: chatId } = message;

    // ------------------------------------------

    const cloudCancelation = await cancelAllNextCloudReservations();
    if (!cloudCancelation) {
      client.sendMessage(chatId, "حدث خدأ ما رجاء التواصل مع الإدارة");
    }

    Reservation.remove(
      (reservation) => new Date(reservation.Date) >= new Date()
    );
    Reservation.save();
    stopBookingAvailability();

    const msg = "تم حذف كل المواعيد المحجوزة من هذه ولأجل غير مسمى";
    client.sendMessage(chatId, msg);
    const group = await bookingGroup(client);
    group.sendMessage(
      "تم تعليق المذاكرة حتى إشعار آخر وتم إلغاء كافة المواعيد المحجوزة ولن تحتسب أية مخالفات على المواعيد الملغاة"
    );
  } catch (error) {
    throw ErrorHandler(error, "cancelAnyResFromNow");
  }
};

export default cancelAnyResFromNow;
