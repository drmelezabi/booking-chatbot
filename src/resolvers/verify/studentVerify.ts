import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import { activatingPin } from "../../config/IDs";
import { registeredData } from "../../controllers/accounts/add/createRegisteredPhone";
import checkTimeIsFitToActiveReservation from "../../controllers/reservations/check/checkTimeIsOkForActivateBooked";
import ActivationPin from "../../database/activationPin";
import RegisteredPhone from "../../database/RegisteredPhone";
import Reservation from "../../database/reservation";

const studentVerify = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  regData: registeredData
) => {
  try {
    const getRes = Reservation.fetch((reservation) => {
      return reservation.accountId === regData.accountId;
    });

    if (!getRes) {
      client.sendMessage(message.from, "📚 **لم تقم بحجز أي موعد للمذاكرة**");
      return;
    }

    const readyForActivating = await checkTimeIsFitToActiveReservation(
      getRes.reservationId
    );

    if (readyForActivating !== 3) {
      let msg = "";

      if (readyForActivating === 1)
        msg = "🕒 **الحجز الخاص بك لم يدخل حيز التنشيط حتى الآن** 🕒";

      if (readyForActivating === 2) {
        ActivationPin.remove(
          (activationObj) => activationObj.reservationId != getRes.reservationId
        );
        ActivationPin.save();

        msg = `🚨 **انتهت المهلة المتاحة لتنشيط الحجز** 🚨\n\nسيتم احتساب مخالفة للتخلف عن الحضور.\n\nيمكنك تجاوز المخالفة إذا دعوت أحد زملائك للاستفادة من الفترة المتبقية من الحجز وذلك من خلال:\nاستخدام رسالة " *ّتمرير* " ⏰`;
      }
      client.sendMessage(message.from, msg);
      return;
    }

    const isExist = ActivationPin.fetch(
      (activationObj) => activationObj.reservationId === getRes.reservationId
    );

    if (isExist) {
      client.sendMessage(
        message.from,
        `🔄 **الأمر قيد التنفيذ، رجاء التواصل مع أحد المشرفين لتنشيط الحجز** 🔄`
      );
      return;
    }

    ActivationPin.create({
      reservationId: getRes.reservationId,
      creationDate: new Date(),
      pin: +activatingPin(),
      name: regData.name,
    });
    ActivationPin.save();

    const reservation = Reservation.fetch(
      (res) => res.reservationId === getRes.reservationId
    );

    if (!reservation) throw new Error("reservation should not be nullable");

    const account = RegisteredPhone.fetch(
      (acc) => acc.accountId === reservation.accountId
    );

    if (!account) throw new Error("account should not be nullable");

    client.sendMessage(
      message.from,
      `🚀 **انتهيت الآن من الخطوة الأولى من خطوات التنفيذ** 🚀\n\nالآن، ${
        account.gender === "male" ? "توجه" : "توجهي"
      } إلى أقرب مشرف لإعطاءك رمز التفعيل. بعد الحصول على رمز التنشيط، ${
        account.gender === "male" ? "أرسل" : "أرسلي"
      } كلمة "!رمز التنشيط" متبوعة بالرمز.`
    );
    return;
  } catch (error) {
    throw ErrorHandler(error, "studentVerify");
  }
};

export default studentVerify;
