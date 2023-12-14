import WAWebJS from "whatsapp-web.js";
import deleteCloudReservation from "../../controllers/rules/deleteReservation";
import { registeredData } from "../../controllers/accounts/createRegisteredPhone";
import Avail from "../../database/avail";
import RegisteredPhone from "../../database/RegisteredPhone";
import Reservation from "../../database/reservation";
import { updateCloudAppointmentById } from "../../controllers/rooms/updateAppointmentById";
import bookingGroup from "../../controllers/GroupManager/getGroup";

const teacherAvail = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  registeredData: registeredData,
  str: string
) => {
  const accountId = registeredData.accountId;

  const isExist = RegisteredPhone.get(
    (account) => account.accountId === accountId
  );

  if (!isExist) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  if (
    !(
      registeredData.type === "teacher" ||
      registeredData.permissions === "admin"
    )
  ) {
    client.sendMessage(message.from, "❌ لا تملك صلاحية التنشيط");
    return;
  }

  const match = str.match(/^!تمرير\s*(\d+\s*)*$/);

  if (!match) {
    await client.sendMessage(message.from, "رمز غير صالح");
    return;
  }

  const avail = Avail.fetch((u) => u.pin === +match[1]);

  if (!avail) {
    await client.sendMessage(message.from, "رمز غير صالح");
    return;
  }

  const threeMinutes = 3 * 60 * 1000;
  const thirtyMinutes = 30 * 60 * 1000;

  const afterResStarted = new Date() > new Date(avail.availCreatedDate);
  const before3MinuetsOfAvailCreation =
    new Date() <
    new Date(new Date(avail.availCreatedDate).getTime() + threeMinutes);
  const beforeReservationEnds =
    new Date() <
    new Date(new Date(avail.reservationDate).getTime() + thirtyMinutes);

  const readyForReplacement =
    afterResStarted && // after start
    before3MinuetsOfAvailCreation && // before 3m of avail creation
    beforeReservationEnds; // before reservation Ends

  if (!readyForReplacement) {
    Avail.remove((avail) => avail.pin === avail.pin);
    Avail.save();
    await client.sendMessage(message.from, "رمز غير صالح");
    return;
  }

  await updateCloudAppointmentById(avail.reservationId, {
    stdId: avail.availId,
    student: avail.availName,
    case: 1,
    supervisor: registeredData.accountId,
  });

  Reservation.remove(
    (reservation) => reservation.reservationId === avail.reservationId
  );
  Reservation.save();

  await deleteCloudReservation(avail.reservationId);

  Avail.remove((avail) => avail.pin === +match[1]);
  Avail.save();

  const group = await bookingGroup(client);
  group.sendMessage(
    `قام الطالب ${avail.availName} بالاستجابة لتمرير حجز الطالب ${avail.host} ومن الآن الحجز خاضع للتنفيذ من الطالب ${avail.availName} تحت إشراف ${registeredData.name}`
  );

  await client.sendMessage(message.from, "تم التنشيط");
};

export default teacherAvail;
