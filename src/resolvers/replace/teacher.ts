import WAWebJS from "whatsapp-web.js";
import getAvail from "../../controllers/rules/getAvail";
import getStudent from "../../controllers/accounts/getStudent";
import removeAvail from "../../controllers/rules/removeAvail";
import { updateAppointmentById } from "../../controllers/rooms/updateAppointmentById";
import removeLocalReservations from "../../controllers/rules/removeLocalReservations";
import deleteReservation from "../../controllers/rules/deleteReservation";
import { registeredData } from "../../controllers/accounts/createRegisteredPhone";

const teacherAvail = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  registeredData: registeredData,
  str: string
) => {
  const studentId = registeredData.studentId;

  const studentData = await getStudent(studentId);

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

  const avails = (await getAvail()).filter((av) => av.pin === +match[1]);

  if (!avails.length) {
    await client.sendMessage(message.from, "رمز غير صالح");
    return;
  }

  const avToDelete: number[] = [];

  const filtered = avails.filter((av) => {
    const threeMinutes = 3 * 60 * 1000;
    const thirtyMinutes = 30 * 60 * 1000;

    const afterResStarted = new Date() > new Date(av.availCreatedDate);
    const before3MinuetsOfAvailCreation =
      new Date() <
      new Date(new Date(av.availCreatedDate).getTime() + threeMinutes);
    const beforeReservationEnds =
      new Date() <
      new Date(new Date(av.reservationDate).getTime() + thirtyMinutes);

    const readyForReplacement =
      afterResStarted && // after start
      before3MinuetsOfAvailCreation && // before 3m of avail creation
      beforeReservationEnds; // before reservation Ends

    if (!readyForReplacement) {
      avToDelete.push(av.pin);
      return false;
    } else return true;
  });

  await Promise.all(avToDelete.map(async (av) => await removeAvail(av)));

  if (!filtered.length) {
    await client.sendMessage(message.from, "رمز غير صالح");
    return;
  }

  await updateAppointmentById(filtered[0].reservationId, {
    stdId: filtered[0].availId,
    student: filtered[0].availName,
    case: 1,
    supervisor: registeredData.studentId,
  });
  await removeLocalReservations(filtered[0].reservationId);
  await deleteReservation(filtered[0].reservationId);
  await removeAvail(+match[1]);

  await client.sendMessage(message.from, "تم التنشيط");
};

export default teacherAvail;
