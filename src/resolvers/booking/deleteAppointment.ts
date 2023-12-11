import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import checkTimeIsFitToCancelReservation from "../../controllers/accounts/checkTimeIsFitToCancelReservation";
import removeLocalReservations from "../../controllers/rules/removeLocalReservations";
import deleteCloudReservation from "../../controllers/rules/deleteReservation";
import Reservation from "../../database/reservation";
import RegisteredPhone from "../../database/RegisteredPhone";

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

  const existedRes = Reservation.fetchAll().filter(
    (std) => std.accountId === isExist.accountId
  );

  if (!existedRes.length) {
    client.sendMessage(message.from, "❌ لا يوجد أي حجز");
    return;
  }

  const ableToDelete = await checkTimeIsFitToCancelReservation(
    existedRes[0].reservationId
  );

  if (!ableToDelete) {
    client.sendMessage(message.from, "❌ لم يعد متاح إلغاء الحجز");
    return;
  }

  await removeLocalReservations(existedRes[0].reservationId);

  await deleteCloudReservation(existedRes[0].reservationId);

  const sticker = MessageMedia.fromFilePath("./src/imgs/garbage.png");
  client.sendMessage(message.from, sticker, {
    sendMediaAsSticker: true,
  });

  client.sendMessage(message.from, "🗑 تم إلغاء الحجز");
};
//
export default deleteAppointment;
