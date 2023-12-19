import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import { registeredData } from "../../controllers/accounts/add/createRegisteredPhone";
import bookingGroup from "../../controllers/GroupManager/getGroup";
import deleteCloudReservation from "../../controllers/reservations/delete/deleteReservation";
import { updateCloudReservationById } from "../../controllers/reservations/update/updateReservationById";
import Avail from "../../database/avail";
import RegisteredPhone from "../../database/RegisteredPhone";
import Reservation from "../../database/reservation";
import db from "../../database/setup";

const teacherAvail = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  registeredData: registeredData,
  str: string
) => {
  try {
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
      client.sendMessage(
        message.from,
        `❌ لا ${
          registeredData.gender === "male" ? "تمتلك" : "تمتلكين"
        } صلاحية التنشيط`
      );
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

    const tenMinutes =
      (db.get<number>("verifyPickupAvailDeadLine") || 10) * 60 * 1000; // Convert 10 minutes to milliseconds
    const thirtyMinutes = 30 * 60 * 1000;

    const afterResStarted = new Date() > new Date(avail.reservationDate);
    const verifyPickupAvailDeadLine =
      new Date() <
      new Date(new Date(avail.availCreatedDate).getTime() + tenMinutes);
    const beforeReservationEnds =
      new Date() <
      new Date(new Date(avail.reservationDate).getTime() + thirtyMinutes);

    const readyForReplacement =
      afterResStarted && // after start
      verifyPickupAvailDeadLine && // before 3m of avail creation
      beforeReservationEnds; // before reservation Ends

    if (!readyForReplacement) {
      Avail.remove((avail) => avail.pin === avail.pin);
      Avail.save();
      await client.sendMessage(message.from, "رمز غير صالح");
      return;
    }

    await updateCloudReservationById(avail.reservationId, {
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
      `${registeredData.gender === "male" ? "قام الطالب" : "قامت الطالبة"}${
        avail.availName
      } بالاستجابة لتمرير حجز ${avail.host} ومن الآن الحجز خاضع للتنفيذ من ${
        registeredData.gender === "male" ? "الطالب" : "الطالبة"
      } ${avail.availName} تحت إشراف ${registeredData.name}`
    );

    await client.sendMessage(message.from, "تم التنشيط");
  } catch (error) {
    throw ErrorHandler(error, "teacherAvail");
  }
};

export default teacherAvail;
