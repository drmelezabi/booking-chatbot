import WAWebJS from "whatsapp-web.js";
import getLocalReservations from "../../controllers/rules/getLocalReservations";
import { registeredData } from "../../controllers/accounts/createRegisteredPhone";
import checkTimeIsFitToActiveReservation from "../../controllers/accounts/checkTimeIsOkForActivateBooked";
import localDb from "../../config/localDb";
import { activatingPin } from "../../config/IDs";

const hostAvail = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  regData: registeredData
) => {
  try {
    const getRes = (await getLocalReservations()).filter((res) => {
      return res.studentId === regData.studentId;
    });

    if (getRes.length !== 1) {
      client.sendMessage(message.from, "📚 **لم تقم بحجز أي موعد للمذاكرة**");
      return;
    }

    const readyForActivating = await checkTimeIsFitToActiveReservation(
      getRes[0].reservationId
    );

    if (readyForActivating !== 2) {
      client.sendMessage(message.from, "الموعد ليس مهدر يمكنك الاستفادة منه");
      return;
    }

    const genPin = +activatingPin();

    localDb.push("/avail[]", genPin, true);
    client.sendMessage(
      message.from,
      `شارك الرمز مع زميلك وأحد المشرفين\n${genPin}`
    );

    return;
  } catch (error: any) {
    console.log(error.message);
    return;
  }
};

export default hostAvail;
