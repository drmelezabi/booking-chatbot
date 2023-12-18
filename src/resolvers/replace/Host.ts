import WAWebJS from "whatsapp-web.js";

import { activatingPin } from "../../config/IDs";
import { registeredData } from "../../controllers/accounts/add/createRegisteredPhone";
import formatDateTime from "../../controllers/date/formateTimestamp";
import bookingGroup from "../../controllers/GroupManager/getGroup";
import Avail from "../../database/avail";
import RegisteredPhone from "../../database/RegisteredPhone";
import Reservation from "../../database/reservation";
import db from "../../database/setup";

const hostAvail = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  registeredData: registeredData
) => {
  try {
    const getRes = Reservation.fetch((res) => {
      return res.accountId === registeredData.accountId;
    });

    if (!getRes) {
      client.sendMessage(
        message.from,
        `📚 **لم ${
          registeredData.gender === "male" ? "تقم" : "تقومي"
        } بحجز أي موعد للمذاكرة**`
      );
      return;
    }
    const twoMinutes = (db.get<number>("availPeriodDeadLine") || 2) * 60 * 1000; // Convert 2 minutes to milliseconds
    const fiveMinuets =
      (db.get<number>("availPeriodDeadLine") || 5) * 60 * 1000; // Convert 3 minutes to milliseconds

    const resDate = new Date(getRes.Date);

    // Calculate the range
    const availPeriodStarts = new Date(resDate.getTime() + twoMinutes);
    const availPeriodDeadLine = new Date(resDate.getTime() + fiveMinuets);

    const isNotStartYet = new Date() < resDate;
    if (isNotStartYet) {
      client.sendMessage(message.from, "الموعد ليس مهدر يمكنك الاستفادة منه");
      return;
    }

    const isِAbleToActive =
      new Date() > resDate && new Date() < availPeriodStarts;
    if (isِAbleToActive) {
      const msg = `الموعد لا زال قابل للتفعيل .. يإمكانك الاستفادة منه`;
      client.sendMessage(message.from, msg);
      return;
    }

    const isAbleForAvail =
      new Date() > availPeriodStarts && new Date() < availPeriodDeadLine;
    if (!isAbleForAvail) {
      const msg = "نأسف لقد انتهت مهلة التمرير المحددة لإنقاذ الحجز من الإهدار";
      client.sendMessage(message.from, msg);
      return;
    }

    const hasAvail = Avail.has((u) => u.hostId === registeredData.accountId);

    if (hasAvail) {
      const msg = "الحجز تم عرضه للتمرير بالفعل";
      client.sendMessage(message.from, msg);
      return;
    }

    const genPin = +activatingPin();

    Avail.create({
      hostId: registeredData.accountId,
      pin: genPin,
      reservationId: getRes.reservationId,
      host: true,
      reservationDate: getRes.Date,
      availCreatedDate: new Date(),
    });
    Avail.save();

    const msg = `${
      registeredData.gender === "male" ? "شارك" : "شاركي"
    } الرمز مع زميلك وأحد المشرفين\n${genPin}`;
    client.sendMessage(message.from, msg);

    const student = RegisteredPhone.fetch(
      (account) => account.accountId === getRes.accountId
    )!;
    const dt = formatDateTime(getRes.Date);

    const group = await bookingGroup(client);
    group.sendMessage(
      `${registeredData.gender === "male" ? "قام الطالب" : "قامت الطالية"} ${
        student.name
      } بالإعلان عن ${
        registeredData.gender === "male" ? "استعداده" : "استعدادها"
      } لتمرير الموعد التالي\n*يوم:* ${dt.Day}\n*تاريخ:* ${
        dt.Date
      }\n*التوقيت:* ${
        dt.Time
      } حيث في حالة رغب أحد الطلاب في الاستفادة من الحجز استخدم الرمز التالي\n !تمرير ${genPin}\n في أسرع وقت ممكن والتوجه لأقرب مشرف .. الرمز صالح لمدة 3 دقائق`
    );

    return;
  } catch (error: any) {
    console.log(error.message);
    return;
  }
};

export default hostAvail;
