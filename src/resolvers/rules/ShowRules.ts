import WAWebJS from "whatsapp-web.js";
import isAdmin from "../../controllers/accounts/isAdmin";
import db from "../../database/setup";
import { arabicName } from "../../config/diff";
import formatDateTime from "../../controllers/date/formateTimestamp";
import starkString from "starkstring";

const showRules = async (client: WAWebJS.Client, message: WAWebJS.Message) => {
  const chatId = message.from;
  // ---------------- Is Admin ----------------
  const errorMessage = await isAdmin(chatId);
  if (typeof errorMessage === "string") {
    await client.sendMessage(chatId, errorMessage);
    return;
  }
  // ------------------------------------------

  const BookingAvailability = () => {
    const blockedDays: {
      SuspendedIndefinitely: boolean;
      SuspendedUntilDate: boolean;
      BookingAvailabilityDate: string;
    } = db.get("BookingAvailability");
    if (blockedDays)
      return `* تعليق الحجز :\n    - متوقف لأجل غير مسمى : ${
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
      db.save();
      db.set("BookingAvailability", data);
      return `* تعليق الحجز :\n    - متوقف لأجل غير مسمى ${"غير نشط"}\n    - متوقف لتاريخ محدد ${"غير نشط"}\n    - تاريخ إعادة الإتاحة${
        formatDateTime(new Date("2023-12-09T21:12:37.789Z")).Date
      }`;
    }
  };

  const maxTimeToBookAfterItsStartInMin = () => {
    const blockedDays = db.get("maxTimeToBookAfterItsStartInMin");
    if (blockedDays)
      return `* الحد الأقصى لحجز موعد بعد بدايته : ${`${blockedDays}`.replace(
        /[\d]/g,
        (match) => starkString(match).arabicNumber().toString()
      )} دقائق`;
    else {
      db.set("maxTimeToBookAfterItsStartInMin", 5);
      db.save();
      return `* موعد متاح للحجز اليومي: ${5} دقائق`;
    }
  };

  const bookingOpen = () => {
    const blockedDays = db.get("bookingOpen");
    if (blockedDays) {
      const h24 = parseInt(blockedDays as unknown as string, 10);
      const hour = h24 > 12 ? `${h24 - 12} مساء` : `${h24} صباحا`;
      return `* أول موعد متاح للحجز اليومي : ${`${hour}`.replace(
        /[\d]/g,
        (match) => starkString(match).arabicNumber().toString()
      )}`;
    } else {
      db.save();
      db.set("bookingOpen", 7);
      return `* أول موعد متاح للحجز اليومي : ${"7 صباحا".replace(
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
      return `* أخر موعد متاح للحجز اليومي : ${`${hour}`.replace(
        /[\d]/g,
        (match) => starkString(match).arabicNumber().toString()
      )}`;
    } else {
      db.save();
      db.set("bookingClose", 17);
      return `* أخر موعد متاح للحجز اليومي : ${"5 مساءً".replace(
        /[\d]/g,
        (match) => starkString(match).arabicNumber().toString()
      )}`;
    }
  };

  const punishmentUnit = () => {
    const blockedDays = db.get("punishmentUnit");
    if (blockedDays)
      return `* معدل أيام الجزاء: ${`${blockedDays}`.replace(/[\d]/g, (match) =>
        starkString(match).arabicNumber().toString()
      )} أيام`;
    else {
      db.save();
      db.set("punishmentUnit", 3);
      return `* معدل أيام الجزاء: ${3} أيام جزاء`;
    }
  };

  const maxTimeBeforeDelete = () => {
    const blockedDays = db.get("maxTimeBeforeDelete");
    if (blockedDays)
      return `* الحد الاقصى المسموح لحذف الحجز قبل بدءه : ${`${blockedDays}`.replace(
        /[\d]/g,
        (match) => starkString(match).arabicNumber().toString()
      )}`;
    else {
      db.save();
      db.set("maxTimeBeforeDelete", 2);
      return `* الحد الاقصى المسموح لحذف الحجز قبل بدءه : ${2}`;
    }
  };

  const blockedDays = () => {
    const blockedDays = db.get("blockedDays");
    type weekDay = ("Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat")[];
    if (blockedDays)
      return "*الأيام المحجوبة:\n - ".concat(
        (blockedDays as weekDay).map((d) => arabicName[d]).join(" - ")
      );
    else {
      db.save();
      db.set("blockedDays", ["Fri"]);
      return "*الأيام المحجوبة:\n-    ".concat(
        ["Fri"].map((d) => arabicName[d]).join(" - ")
      );
    }
  };

  const rooms = () => {
    const rooms = db.get("rooms");
    if (rooms)
      return "*الغرف المتاحة للحجز: ".concat(
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
      db.save();
      db.set("rooms", data);
      return "*الغرف المتاحة للحجز: ".concat(data.join(" ~ "));
    }
  };

  const msg = `*الفواعد العامة للمنظومة*\n\n${BookingAvailability()}\n${maxTimeToBookAfterItsStartInMin()}\n${bookingOpen()}\n${bookingClose()}\n${blockedDays()}\n${punishmentUnit()}\n${maxTimeBeforeDelete()}\n${rooms()}\n`;
  await client.sendMessage(chatId, msg);
};

export default showRules;
