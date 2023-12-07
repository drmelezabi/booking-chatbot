import WAWebJS from "whatsapp-web.js";
import getLocalReservations from "../../controllers/rules/getLocalReservations";
import localDb from "../../config/localDb";
import { activatingPin } from "../../config/IDs";
import getAvail, { IAvail } from "../../controllers/rules/getAvail";
import { registeredData } from "../../controllers/accounts/createRegisteredPhone";

const hostAvail = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  registeredData: registeredData
) => {
  try {
    const getRes = (await getLocalReservations()).filter((res) => {
      return res.studentId === registeredData.studentId;
    });

    if (getRes.length !== 1) {
      client.sendMessage(message.from, "📚 **لم تقم بحجز أي موعد للمذاكرة**");
      return;
    }
    const tenMinutes = 10 * 60 * 1000; // Convert 15 minutes to milliseconds
    const threeMinutes = 3 * 60 * 1000; // Convert 18 minutes to milliseconds

    const resDate = new Date(getRes[0].Date);

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

    const hasAvail = (await getAvail()).filter(
      (av) => av.hostId === registeredData.studentId
    );

    if (hasAvail.length) {
      const msg = "الحجز تم عرضه للتمرير بالفعل";
      client.sendMessage(message.from, msg);
      return;
    }

    const genPin = +activatingPin();

    const avail: IAvail = {
      hostId: registeredData.studentId,
      pin: genPin,
      reservationId: getRes[0].reservationId,
      host: true,
      reservationDate: getRes[0].Date,
      availCreatedDate: new Date(),
    };

    localDb.push("/avail[]", avail, true);
    // Save the data (useful if you disable the saveOnPush)
    await localDb.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await localDb.reload();

    const msg = `شارك الرمز مع زميلك وأحد المشرفين\n${genPin}`;
    client.sendMessage(message.from, msg);

    return;
  } catch (error: any) {
    console.log(error.message);
    return;
  }
};

export default hostAvail;
