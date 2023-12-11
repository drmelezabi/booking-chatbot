import WAWebJS from "whatsapp-web.js";
import getStudent from "../../controllers/accounts/getStudent";
import { updateAppointmentById } from "../../controllers/rooms/updateAppointmentById";
import removeLocalReservations from "../../controllers/rules/removeLocalReservations";
import deleteReservation from "../../controllers/rules/deleteReservation";
import { registeredData } from "../../controllers/accounts/createRegisteredPhone";
import Avail from "../../database/avail";

const teacherAvail = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  registeredData: registeredData,
  str: string
) => {
  const accountId = registeredData.accountId;

  const studentData = await getStudent(accountId);

  if (!studentData) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  if (!(registeredData.type === "teacher" || registeredData.admin === true)) {
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

  await updateAppointmentById(avail.reservationId, {
    stdId: avail.availId,
    student: avail.availName,
    case: 1,
    supervisor: registeredData.accountId,
  });
  await removeLocalReservations(avail.reservationId);
  await deleteReservation(avail.reservationId);

  Avail.remove((avail) => avail.pin === +match[1]);
  Avail.save();

  await client.sendMessage(message.from, "تم التنشيط");
};

export default teacherAvail;
