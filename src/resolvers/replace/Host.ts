import WAWebJS from "whatsapp-web.js";
import { activatingPin } from "../../config/IDs";
import { registeredData } from "../../controllers/accounts/add/createRegisteredPhone";
import Avail from "../../database/avail";
import Reservation from "../../database/reservation";
import RegisteredPhone from "../../database/RegisteredPhone";
import formatDateTime from "../../controllers/date/formateTimestamp";
import bookingGroup from "../../controllers/GroupManager/getGroup";

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
      client.sendMessage(message.from, "📚 **لم تقم بحجز أي موعد للمذاكرة**");
      return;
    }
    const tenMinutes = 10 * 60 * 1000; // Convert 15 minutes to milliseconds
    const threeMinutes = 3 * 60 * 1000; // Convert 18 minutes to milliseconds

    const resDate = new Date(getRes.Date);

    // Calculate the range
    const firstUpperBound = new Date(resDate.getTime() + tenMinutes);
    const secondUpperBound = new Date(firstUpperBound.getTime() + threeMinutes);

    const isNotStartYet = new Date() < resDate;
    if (isNotStartYet) {
      client.sendMessage(message.from, "الموعد ليس مهدر يمكنك الاستفادة منه");
      return;
    }

    const isِAbleToActive =
      new Date() > resDate && new Date() < firstUpperBound;
    if (isِAbleToActive) {
      const msg = `الموعد لا زال قابل للتفعيل .. يإمكانك الاستفادة منه`;
      client.sendMessage(message.from, msg);
      return;
    }

    const isAbleForAvail =
      new Date() > firstUpperBound && new Date() < secondUpperBound;
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

    const msg = `شارك الرمز مع زميلك وأحد المشرفين\n${genPin}`;
    client.sendMessage(message.from, msg);

    const student = RegisteredPhone.fetch(
      (account) => account.accountId === getRes.accountId
    )!;
    const dt = formatDateTime(getRes.Date);

    const group = await bookingGroup(client);
    group.sendMessage(
      `قام الطالب ${student.name} بالإعلان عن استعداده لتمرير الموعد التالي\n*يوم:* ${dt.Day}\n*تاريخ:* ${dt.Date}\n*التوقيت:* ${dt.Time} حيث في حالة وجود أحد الطلاب في حالة رغبتك في الاستفادة من الحجز استخدم الرمز التالي|\n !تمرير ${genPin}\n في أسرع وقت الرمز صالح لمدة 3 دقائق`
    );

    return;
  } catch (error: any) {
    console.log(error.message);
    return;
  }
};

export default hostAvail;
