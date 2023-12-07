import WAWebJS, { MessageMedia } from "whatsapp-web.js";

import { dtOptions } from "../../config/diff";
import getAccountByChatId from "../../controllers/accounts/getStudentByChatId";
import getStudentViolations from "../../controllers/accounts/getStudentViolations";
import getAvail from "../../controllers/rules/getAvail";
import getStudentsSuspension from "../../controllers/rules/getStudentsSuspension";
import updateLocalAvailObj from "../../controllers/rules/updateAvail";
import removeAvail from "../../controllers/rules/removeAvail";

const hostAvail = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  str: string
) => {
  try {
    const isExist = await getAccountByChatId(message.from);
    if (isExist === null) {
      client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
      return;
    }

    if (isExist.type !== "student") {
      client.sendMessage(message.from, "❌ الطالب فقط هو من يملك ميزة الحجز");
      return;
    }

    const studentId = isExist.studentId;
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
      client.sendMessage(
        message.from,
        `يبدو أنك موقوف عن حجز قاعات المذاكرة وفقا لتجاوز عدد مرات المخالفات\n حيث أن عدد مخالفاتك وصلت ${
          suspension[0].ViolationCounter
        } مرات\nالإيقف ينتهي في ${dt.toLocaleDateString("ar-EG", dtOptions)}`
      );
      return;
    }

    const match = str.match(
      /^![اإأ]نتفع\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)$/
    );

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

    await Promise.all(avToDelete.map(async (av) => await removeAvail(av)));

    const filtered = avails.map((av) => {
      const cAse =
        new Date() <
        new Date(new Date(av.date).getTime() + 3 * 60 * 1000 + 7200000);
      if (!cAse) avToDelete.push(av.pin);

      return cAse;
    });

    if (!filtered.length) {
      await client.sendMessage(message.from, "رمز غير صالح");
      return;
    }

    await updateLocalAvailObj(+match[1], { availId: isExist.studentId });

    client.sendMessage(message.from, "الموعد جاهز للتفعيل مع المشرف");

    return;
  } catch (error: any) {
    console.log(error.message);
    return;
  }
};

export default hostAvail;
