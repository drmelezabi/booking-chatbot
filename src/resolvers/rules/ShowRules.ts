import starkString from "starkstring";
import WAWebJS from "whatsapp-web.js";

import {
  arabicDays,
  arabicHours,
  arabicMinuets,
  arabicName,
  dict,
} from "../../config/diff";
import ErrorHandler from "../../config/errorhandler";
import formatDateTime from "../../controllers/date/formateTimestamp";
import db from "../../database/setup";

const showRules = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  try {
    const chatId = message.from;

    const BookingAvailability = () => {
      const blockedDays: {
        SuspendedIndefinitely: boolean;
        SuspendedUntilDate: boolean;
        BookingAvailabilityDate: string;
      } = db.get("BookingAvailability");
      if (blockedDays)
        return `◈ *تعليق الحجز* :\n    - متوقف لأجل غير مسمى : ${
          blockedDays.SuspendedIndefinitely ? "نشط" : "غير نشط"
        }\n    - متوقف لتاريخ محدد : ${
          blockedDays.SuspendedUntilDate ? "نشط" : "غير نشط"
        }\n    - تاريخ إعادة الإتاحة : ${
          formatDateTime(new Date(blockedDays.BookingAvailabilityDate)).Date
        }`;
      else {
        const data = {
          SuspendedIndefinitely: false,
          SuspendedUntilDate: false,
          BookingAvailabilityDate: "2023-12-09T21:12:37.789Z",
        };
        db.set("BookingAvailability", data);
        db.save();
        return `* تعليق الحجز :\n    - متوقف لأجل غير مسمى ${"غير نشط"}\n    - متوقف لتاريخ محدد ${"غير نشط"}\n    - تاريخ إعادة الإتاحة${
          formatDateTime(new Date("2023-12-09T21:12:37.789Z")).Date
        }`;
      }
    };

    const maxTimeToBookAfterItsStartInMin = () => {
      const blockedDays = db.get("maxTimeToBookAfterItsStartInMin");
      if (blockedDays)
        return `◈ *اخر موعد لحجز موعد بعد بدءه* : ${arabicMinuets(
          parseInt(`${blockedDays}`, 10)
        )}`;
      else {
        db.set("maxTimeToBookAfterItsStartInMin", 5);
        db.save();
        return `◈ *اخر موعد لحجز موعد بعد بدءه* : ${arabicMinuets(5)}`;
      }
    };

    const bookingOpen = () => {
      const blockedDays = db.get("bookingOpen");
      if (blockedDays) {
        const h24 = parseInt(blockedDays as unknown as string, 10);
        const hour = h24 > 12 ? `${h24 - 12} مساء` : `${h24} صباحا`;
        return `◈ *أول موعد متاح للحجز اليومي* : ${`${hour}`.replace(
          /[\d]/g,
          (match) => starkString(match).arabicNumber().toString()
        )}`;
      } else {
        db.set("bookingOpen", 7);
        db.save();
        return `◈ *أول موعد متاح للحجز اليومي* : ${"7 صباحا".replace(
          /[\d]/g,
          (match) => starkString(match).arabicNumber().toString()
        )}`;
      }
    };

    const bookingClose = () => {
      const blockedDays = db.get("bookingClose");
      if (blockedDays) {
        const h24 = parseInt(blockedDays as unknown as string, 10);
        const hour = h24 > 12 ? `${h24 - 12} مساء` : `${h24} صباحا`;
        return `◈ *أخر موعد متاح للحجز اليومي* : ${`${hour}`.replace(
          /[\d]/g,
          (match) => starkString(match).arabicNumber().toString()
        )}`;
      } else {
        db.set("bookingClose", 17);
        db.save();
        return `◈ *أخر موعد متاح للحجز اليومي* : ${"5 مساءً".replace(
          /[\d]/g,
          (match) => starkString(match).arabicNumber().toString()
        )}`;
      }
    };

    const punishmentUnit = () => {
      const blockedDays = db.get("punishmentUnit");
      if (blockedDays)
        return `◈ *معدل أيام الجزاء* : ${arabicDays(
          parseInt(`${blockedDays}`, 10)
        )}`;
      else {
        db.set("punishmentUnit", 3);
        db.save();
        return `◈ *معدل أيام الجزاء* : ${arabicDays(3)} جزاء`;
      }
    };

    const maxTimeBeforeDelete = () => {
      const blockedDays = db.get("maxTimeBeforeDelete");
      if (blockedDays)
        return `◈ *الحد الاقصى المسموح لحذف الحجز قبل بدءه* : ${arabicHours(
          parseInt(`${blockedDays}`, 10)
        )}`;
      else {
        db.set("maxTimeBeforeDelete", 2);
        db.save();
        return `◈ *الحد الاقصى المسموح لحذف الحجز قبل بدءه* : ${arabicHours(
          2
        )}`;
      }
    };

    const activatingPeriodBeforeStart = () => {
      const minutes = db.get("activatingPeriodBeforeStart");
      if (minutes)
        return `◈ *يبدأ نطاق تفعيل الحجز قبل بدء الموعد بـ* : ${arabicMinuets(
          parseInt(`${minutes}`, 10)
        )}`;
      else {
        db.set("activatingPeriodBeforeStart", 5);
        db.save();
        return `◈ *يبدأ نطاق تفعيل الحجز قبل بدء الموعد بـ* : ${arabicMinuets(
          5
        )}`;
      }
    };

    const activatingPeriodAfterStart = () => {
      const minutes = db.get("activatingPeriodAfterStart");
      if (minutes)
        return `◈ *ينتهي نطاق تفعيل الحجز بعد بدء الموعد بـ* : ${arabicMinuets(
          parseInt(`${minutes}`, 10)
        )}`;
      else {
        db.set("activatingPeriodAfterStart", 10);
        db.save();
        return `◈ *ينتهي نطاق تفعيل الحجز بعد بدء الموعد بـ* : ${arabicMinuets(
          10
        )}`;
      }
    };

    const availPeriodStarts = () => {
      const minutes = db.get("availPeriodStarts");
      if (minutes)
        return `◈ *يبدأ نطاق تمرير الحجز بعد بدء الموعد بـ* : ${arabicMinuets(
          parseInt(`${minutes}`, 10)
        )}`;
      else {
        db.set("availPeriodStarts", 2);
        db.save();
        return `◈ *يبدأ نطاق تمرير الحجز بعد بدء الموعد بـ* : ${arabicMinuets(
          2
        )}`;
      }
    };

    const availPeriodEnds = () => {
      const minutes = db.get("availPeriodEnds");
      if (minutes)
        return `◈ *ينتهي نطاق تمرير الحجز بعد بدء الموعد بـ* : ${arabicMinuets(
          parseInt(`${minutes}`, 10)
        )}`;
      else {
        db.set("availPeriodEnds", 5);
        db.save();
        return `◈ *ينتهي نطاق تمرير الحجز بعد بدء الموعد بـ* : ${arabicMinuets(
          3
        )}`;
      }
    };

    const verifyPickupAvailDeadLine = () => {
      const minutes = db.get("verifyPickupAvailDeadLine");
      if (minutes)
        return `◈ *الحد الأقصي لتفعيل حجز تم تمريره هو* : ${arabicMinuets(
          parseInt(`${minutes}`, 10)
        )}`;
      else {
        db.set("verifyPickupAvailDeadLine", 10);
        db.save();
        return `◈ *الحد الأقصي لتفعيل حجز تم تمريره هو* : ${arabicMinuets(3)}`;
      }
    };

    const blockedDays = () => {
      const blockedDays = db.get("blockedDays");
      type weekDay = ("Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat")[];
      if (blockedDays)
        return "◈ *الأيام المحجوبة* : ".concat(
          (blockedDays as weekDay).map((d) => arabicName[d]).join(" ~ ")
        );
      else {
        db.set("blockedDays", ["Fri"]);
        db.save();
        return "◈ *الأيام المحجوبة* : ".concat(
          ["Fri"].map((d) => arabicName[d]).join(" ~ ")
        );
      }
    };

    const rooms = () => {
      const rooms = db.get("rooms");
      if (rooms)
        return "◈ *الغرف المتاحة للحجز* : ".concat(
          (rooms as string[])
            .map((r) =>
              r.replace(/[\d]/g, (match) =>
                starkString(match).arabicNumber().toString()
              )
            )
            .join(" ~ ")
        );
      else {
        const data = [
          "107",
          "109",
          "105",
          "معمل أ",
          "معمل ب",
          "106 أ",
          "106 ب",
        ].map((r) =>
          r.replace(/[\d]/g, (match) =>
            starkString(match).arabicNumber().toString()
          )
        );
        db.set("rooms", data);
        db.save();
        return "◈ *الغرف المتاحة للحجز* : ".concat(data.join(" ~ "));
      }
    };

    const dictionary = () => {
      const dic = db.get("dictionary");
      if (!dic) {
        db.set("dictionary", dict);
        db.save();
      }
    };

    dictionary();

    const msg = `📋 *القواعد العامة للمنظومة* 📋\n\n${BookingAvailability()}\n\n${maxTimeBeforeDelete()}\n${maxTimeToBookAfterItsStartInMin()}\n\n${activatingPeriodBeforeStart()}\n${activatingPeriodAfterStart()}\n\n${availPeriodStarts()}\n${availPeriodEnds()}\n${verifyPickupAvailDeadLine()}\n\n${bookingOpen()}\n${bookingClose()}\n\n${punishmentUnit()}\n${blockedDays()}\n${rooms()}`;
    await client.sendMessage(chatId, msg);
  } catch (error) {
    throw ErrorHandler(error, "showRules");
  }
};

export default showRules;
