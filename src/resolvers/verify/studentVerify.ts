import WAWebJS from "whatsapp-web.js";
import { registeredData } from "../../controllers/accounts/createRegisteredPhone";
import checkTimeIsFitToActiveReservation from "../../controllers/accounts/checkTimeIsOkForActivateBooked";
import { activatingPin } from "../../config/IDs";
import removeActivationPin from "../../controllers/rules/removeActivationPin";
import Reservation from "../../database/reservation";
import ActivationPin from "../../database/activationPin";

const studentVerify = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  regData: registeredData
) => {
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
      await removeActivationPin(getRes.reservationId);
      msg = `🚨 **انتهت المهلة المتاحة لتنشيط الحجز** 🚨\n\nسيتم احتساب مخالفة للتخلف عن الحضور.\n\nيمكنك تجاوز المخالفة إذا دعوت أحد زملائك للاستفادة من الفترة المتبقية من الحجز وذلك من خلال:\nاستخدام رسالة " *موعد مهدر* " ⏰`;
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
      "🔄 **الأمر قيد التنفيذ، رجاء التواصل مع أحد المشرفين لتنشيط الحجز** 🔄"
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

  client.sendMessage(
    message.from,
    '🚀 **انتهيت الآن من الخطوة الأولى من خطوات التنفيذ** 🚀\n\nالآن، توجه إلى أقرب مشرف لإعطاءك رمز التفعيل. بعد الحصول على رمز التنشيط، ارسل كلمة "!رمز التنشيط" متبوعة بالرمز.'
  );
  return;
};

export default studentVerify;
