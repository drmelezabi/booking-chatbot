import starkString from "starkstring";
import WAWebJS from "whatsapp-web.js";

import bookingGroup from "../../controllers/GroupManager/getGroup";
import getCloudReservationById from "../../controllers/reservations/get/getCloudReservation";
import { updateCloudReservationById } from "../../controllers/reservations/update/updateReservationById";
import ActivationPin from "../../database/activationPin";
import RegisteredPhone from "../../database/RegisteredPhone";
import Reservation from "../../database/reservation";

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

  const account = Reservation.fetch(
    (res) => res.reservationId === ExistedActivationObj.reservationId
  )!;

  if (!account) {
    client.sendMessage(message.from, "حدث خطأ تواصل مع الإدارة");
    return;
  }

  const student = RegisteredPhone.fetch(
    (std) => std.accountId === account.accountId
  )!;

  // Calculate the range
  const upperBound = new Date(resDate.getTime() + oneMinute);

  // Check if dateA is within the range
  if (new Date() > upperBound) {
    ActivationPin.remove(
      (activationObj) =>
        activationObj.reservationId === ExistedActivationObj.reservationId
    );
    ActivationPin.save();
    const msg = `🚀 **${
      student.gender === "male" ? "انتهيت" : "انتهيتي"
    } الآن من الخطوة الأولى من خطوات التنفيذ** 🚀\n\nالآن، ${
      student.gender === "male" ? "توجه" : "توجهي"
    } إلى أقرب مشرف لإعطاءك رمز التفعيل. بعد الحصول على رمز التنشيط، ${
      student.gender === "male" ? "أرسل" : "أرسلي"
    } كلمة "!رمز التنشيط" متبوعة بالرمز.`;
    client.sendMessage(message.from, msg);
    return;
  }

  if (new Date() <= upperBound) {
    await updateCloudReservationById(ExistedActivationObj.reservationId, {
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
      `🎉 **تم تنشيط الحجز الخاص ${
        student.gender === "male" ? "بالطالب" : "بالطالبة"
      } ${reservationData.student} تحت إشراف ${reservationData.supervisor}** 🎉

${student.gender === "male" ? "الطالب" : "الطالبة"} حالياً ${
        student.gender === "male" ? "يتواجد" : "تتواجد"
      } للمذاكرة في الغرفة ${reservationData.room.replace(/[\d]/g, (match) =>
        starkString(match).arabicNumber().toString()
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
