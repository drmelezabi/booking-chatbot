import WAWebJS from "whatsapp-web.js";
import { updateCloudAppointmentById } from "../../controllers/rooms/updateAppointmentById";
import starkString from "starkstring";
import Reservation from "../../database/reservation";
import ActivationPin from "../../database/activationPin";
import getCloudReservationById from "../../controllers/reservations/getCloudReservation";
import bookingGroup from "../../controllers/GroupManager/getGroup";

const studentActive = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  customMsg: string
) => {
  const match = customMsg.match(
    /^!تنشيط\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/
  );
  const chatId = message.from;

  if (!match) {
    await client.sendMessage(chatId, "رمز غير صالح");
    return;
  }

  const pin = match[1].replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (match) =>
    starkString(match).englishNumber().toString()
  );

  const ExistedActivationObj = ActivationPin.fetch(
    (activationObj) => activationObj.pin === +pin
  );
  if (!ExistedActivationObj) {
    client.sendMessage(message.from, "رمز التنشيط غير صحيح");
    return;
  }

  const oneMinute = 1 * 60 * 1000; // Convert 1 minute to milliseconds

  const resDate = new Date(ExistedActivationObj.creationDate);

  // Calculate the range
  const upperBound = new Date(resDate.getTime() + oneMinute);

  // Check if dateA is within the range
  if (new Date() > upperBound) {
    ActivationPin.remove(
      (activationObj) =>
        activationObj.reservationId === ExistedActivationObj.reservationId
    );
    ActivationPin.save();
    const msg =
      '🚀 **انتهيت الآن من الخطوة الأولى من خطوات التنفيذ** 🚀\n\nالآن، توجه إلى أقرب مشرف لإعطاءك رمز التفعيل. بعد الحصول على رمز التنشيط، ارسل كلمة "!رمز التنشيط" متبوعة بالرمز.';
    client.sendMessage(message.from, msg);
    return;
  }

  if (new Date() <= upperBound) {
    await updateCloudAppointmentById(ExistedActivationObj.reservationId, {
      case: 1,
    });

    const reservationData = await getCloudReservationById(
      ExistedActivationObj.reservationId
    );
    if (!reservationData) {
      client.sendMessage(message.from, "حدث خطأ تواصل مع الإدارة");
      return;
    }

    const group = await bookingGroup(client);
    group.sendMessage(
      `🎉 **تم تنشيط الحجز الخاص بالطالب ${reservationData.student} تحت إشراف ${
        reservationData.supervisor
      }** 🎉

الطالب حالياً يتواجد للمذاكرة في الغرفة ${reservationData.room.replace(
        /[\d]/g,
        (match) => starkString(match).arabicNumber().toString()
      )}`
    );

    Reservation.remove(
      (reservation) =>
        reservation.reservationId === ExistedActivationObj.reservationId
    );
    Reservation.save();
    ActivationPin.remove(
      (activationObj) =>
        activationObj.reservationId === ExistedActivationObj.reservationId
    );
    ActivationPin.save();

    const msg = `🎉 **تم تنشيط الحجز بنجاح! نتمنى لك التوفيق** 🎉`;
    client.sendMessage(message.from, msg);
    return;
  }
};

export default studentActive;
