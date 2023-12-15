import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import checkTimeIsFitToCancelReservation from "../../controllers/reservations/checkTimeIsFitToCancelReservation";
import deleteCloudReservation from "../../controllers/reservations/deleteReservation";
import Reservation from "../../database/reservation";
import RegisteredPhone from "../../database/RegisteredPhone";
import bookingGroup from "../../controllers/GroupManager/getGroup";
import formatDateTime from "../../controllers/date/formateTimestamp";

const deleteAppointment = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const isExist = RegisteredPhone.fetch(
    (account) => account.chatId === message.from
  );

  if (!isExist) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  if (isExist.type !== "student") {
    client.sendMessage(message.from, "❌ الطالب فقط هو من يملك ميزة الحجز");
    return;
  }

  const existedRes = Reservation.fetch(
    (std) => std.accountId === isExist.accountId
  );

  console.log({ existedRes });

  if (!existedRes) {
    client.sendMessage(message.from, "❌ لا يوجد أي حجز");
    return;
  }

  const ableToDelete = await checkTimeIsFitToCancelReservation(
    existedRes.reservationId
  );

  if (!ableToDelete) {
    client.sendMessage(message.from, "❌ لم يعد متاح إلغاء الحجز");
    return;
  }
  const reservation = Reservation.fetch(
    (reservation) => reservation.reservationId === existedRes.reservationId
  )!;

  Reservation.remove(
    (reservation) => reservation.reservationId === existedRes.reservationId
  );
  Reservation.save();

  await deleteCloudReservation(existedRes.reservationId);

  const sticker = MessageMedia.fromFilePath("./src/imgs/garbage.png");
  client.sendMessage(message.from, sticker, {
    sendMediaAsSticker: true,
  });

  client.sendMessage(message.from, "🗑 تم إلغاء الحجز");

  const dt = formatDateTime(new Date(reservation.Date));

  const group = await bookingGroup(client);
  group.sendMessage(
    `🚫 **قام الطالب ${isExist.name} بإلغاء حجز بهذا التوقيت** 🚫

*يوم:* ${dt.Day}
*تاريخ:* ${dt.Date}
*التوقيت:* ${dt.Time}

وعليه، الموعد لم يعد محجوز
  `
  );
  return;
};
//
export default deleteAppointment;
