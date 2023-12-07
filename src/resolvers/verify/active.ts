import WAWebJS from "whatsapp-web.js";
import localDb from "../../config/localDb";
import { IActivationObject } from "../../controllers/rules/createActivationPin";
import removeActivationPin from "../../controllers/rules/removeActivationPin";
import { updateAppointmentById } from "../../controllers/rooms/updateAppointmentById";
import removeLocalReservations from "../../controllers/rules/removeLocalReservations";
import starkString from "starkstring";

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

  const isExist = (
    await localDb.getObject<IActivationObject[]>("/activationPin")
  ).filter((activationObj) => activationObj.pin === +pin);

  if (!isExist.length) {
    client.sendMessage(message.from, "رمز التنشيط غير صحيح");
    return;
  }

  const res = isExist[0];

  const oneMinute = 1 * 60 * 1000; // Convert 1 minute to milliseconds

  const resDate = new Date(res.creationDate);

  // Calculate the range
  const upperBound = new Date(resDate.getTime() + oneMinute);

  // Check if dateA is within the range
  if (!(new Date() <= upperBound)) {
    await removeActivationPin(res.reservationId);
    const msg =
      '🚀 **انتهيت الآن من الخطوة الأولى من خطوات التنفيذ** 🚀\n\nالآن، توجه إلى أقرب مشرف لإعطاءك رمز التفعيل. بعد الحصول على رمز التنشيط، ارسل كلمة "!رمز التنشيط" متبوعة بالرمز.';
    client.sendMessage(message.from, msg);
    return;
  }

  if (new Date() <= upperBound) {
    await updateAppointmentById(res.reservationId, { case: 1 });
    await removeLocalReservations(res.reservationId);
    await removeActivationPin(res.reservationId);
    const msg = `🎉 **تم تنشيط الحجز بنجاح! نتمنى لك التوفيق** 🎉`;
    client.sendMessage(message.from, msg);
    return;
  }
};

export default studentActive;
