import WAWebJS, { MessageMedia } from "whatsapp-web.js";

import { dtOptions } from "../../config/diff";
import getStudentViolations from "../../controllers/accounts/getStudentViolations";
import getAvail from "../../controllers/rules/getAvail";
import getStudentsSuspension from "../../controllers/rules/getStudentsSuspension";
import updateLocalAvailObj from "../../controllers/rules/updateAvail";
import removeAvail from "../../controllers/rules/removeAvail";
import { registeredData } from "../../controllers/accounts/createRegisteredPhone";

const colleagueAvail = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  registeredData: registeredData,
  str: string
) => {
  try {
    if (registeredData.type !== "student") {
      client.sendMessage(message.from, "❌ الطالب فقط هو من يملك ميزة الحجز");
      return;
    }

    const studentId = registeredData.studentId;

    const isExistedInSuspensionList = (await getStudentsSuspension()).filter(
      (sus) => sus.studentId === registeredData.studentId
    );

    if (isExistedInSuspensionList.length) {
      await getStudentViolations(studentId);
      const suspension = (await getStudentsSuspension()).filter(
        (stdCase) => stdCase.studentId === studentId && stdCase
      );

      if (suspension.length && suspension[0].suspensionCase) {
        const dt = suspension[0].BookingAvailabilityDate;
        const sticker = MessageMedia.fromFilePath("./src/imgs/rejected.png");
        client.sendMessage(message.from, sticker, {
          sendMediaAsSticker: true,
        });
        const msg = `يبدو أنك موقوف عن حجز قاعات المذاكرة وفقا لتجاوز عدد مرات المخالفات\n حيث أن عدد مخالفاتك وصلت ${
          suspension[0].ViolationCounter
        } مرات\nالإيقف ينتهي في ${dt.toLocaleDateString("ar-EG", dtOptions)}`;
        client.sendMessage(message.from, msg);
        return;
      }
    }

    const match = str.match(/^!تمرير\s*(\d+\s*)*$/);

    if (!match) {
      console.log(2222);
      await client.sendMessage(message.from, "رمز غير صالح");
      return;
    }

    console.log({ object: +match[1] });

    const avails = (await getAvail()).filter((av) => av.pin === +match[1]);

    if (!avails.length) {
      console.log(1111);
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
      console.log(33333);
      await client.sendMessage(message.from, "رمز غير صالح");
      return;
    }

    await updateLocalAvailObj(+match[1], {
      availId: registeredData.studentId,
      availName: registeredData.name,
    });

    client.sendMessage(message.from, "الموعد جاهز للتفعيل مع المشرف");

    return;
  } catch (error: any) {
    console.log(error.message);
    return;
  }
};

export default colleagueAvail;
