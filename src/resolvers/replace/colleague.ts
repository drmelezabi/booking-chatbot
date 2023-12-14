import WAWebJS, { MessageMedia } from "whatsapp-web.js";

import { dtOptions } from "../../config/diff";
import getStudentViolations from "../../controllers/accounts/getStudentViolations";
import { registeredData } from "../../controllers/accounts/createRegisteredPhone";
import Avail from "../../database/avail";
import SuspendedStudent from "../../database/suspendedStudent";

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

    const accountId = registeredData.accountId;

    const isExistedInSuspensionList = SuspendedStudent.fetch(
      (sus) => sus.accountId === registeredData.accountId
    );

    if (isExistedInSuspensionList) {
      await getStudentViolations(accountId);

      const suspension = SuspendedStudent.fetch(
        (stdCase) =>
          stdCase.accountId === accountId && stdCase.suspensionCase === true
      );

      if (suspension && suspension.suspensionCase) {
        const dt = suspension.BookingAvailabilityDate;
        const sticker = MessageMedia.fromFilePath("./src/imgs/rejected.png");
        client.sendMessage(message.from, sticker, {
          sendMediaAsSticker: true,
        });
        const msg = `يبدو أنك موقوف عن حجز قاعات المذاكرة وفقا لتجاوز عدد مرات المخالفات\n حيث أن عدد مخالفاتك وصلت ${
          suspension.ViolationCounter
        } مرات\nالإيقف ينتهي في ${dt.toLocaleDateString("ar-EG", dtOptions)}`;
        client.sendMessage(message.from, msg);
        return;
      }
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
      Avail.remove((avail) => avail.pin === +match[1]);
      Avail.save();
      await client.sendMessage(message.from, "رمز غير صالح");
      return;
    }

    Avail.update((avail) => {
      if (avail.pin === +match[1]) {
        avail.availId = registeredData.accountId;
        avail.availName = registeredData.name;
      }
    });
    Avail.save();

    client.sendMessage(message.from, "الموعد جاهز للتفعيل مع المشرف");
    return;
  } catch (error: any) {
    client.sendMessage(
      message.from,
      "حدث خطأ غير متوقع إذا استمرت المشكلة تواصل مع الإدارة"
    );
    console.log(error.message);
    return;
  }
};

export default colleagueAvail;
