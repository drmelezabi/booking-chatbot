import starkString from "starkstring";
import WAWebJS from "whatsapp-web.js";

import cancelAnyResFromNow from "./cancelAnyResFromNow";
import cancelRestOfDayReservations from "./cancelRestOfDay";
import detectDateFromString from "../../../controllers/date/detectDateFromString";
import { cancelResFromNowToDate } from "../../../controllers/rooms/cancel/cancelResFromNowToDate";
import isAdmin from "../../../controllers/rules/isAdmin";
import startBookingAvailability from "../../../controllers/rules/startBookingAvailability";
import stopBookingAvailability from "../../../controllers/rules/stopBookingAvailability";
import Chat from "../../../database/chat";
import RegisteredPhone from "../../../database/RegisteredPhone";
import Reservation from "../../../database/reservation";

const reservationAvailabilityControl = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message,
  counter: number,
  collectingData: { [key: string]: unknown }
) => {
  const registeredData = RegisteredPhone.fetch(
    (account) => account.chatId === message.from
  );
  if (!registeredData) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }
  const { from: chatId } = message;
  // ---------------- Is Admin ----------------
  const errorMessage = await isAdmin(chatId);
  if (typeof errorMessage === "string") {
    await client.sendMessage(chatId, errorMessage);
    return;
  }

  const isExist = RegisteredPhone.fetch(
    (account) => account.chatId === message.from
  );
  if (!isExist) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  const optionsDate: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Cairo",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const date = new Intl.DateTimeFormat("ar-EG", optionsDate);

  if (counter === 0) {
    Chat.create({
      id: isExist.accountId,
      counter: 1,
      data: {},
      lastMessage: new Date(),
      taskSyntax: "!حالة المنظومة",
    });
    Chat.save();
    const msg = `ما هو الإجراء المطلوب تطبيقه على حالة منظومة الحجز\n    ◈ *تعليق لأجل غير مسمى* \n    ◈ *تعليق اليوم* \n    ◈ *تعليق حتى [تاريخ محدد]* \n        - _مثال: تعليق حتى 5 أغسطس_ \n    ◈ *إتاحة المذاكرة*`;
    client.sendMessage(message.from, msg);
    return;
  }

  if (counter === 1) {
    if (message.body === "تعليق اليوم") {
      await cancelRestOfDayReservations(client, message);
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      return;
    }

    if (/تعليق ل[اإآأ]جل غير مسم[يى]/.test(message.body)) {
      await cancelAnyResFromNow(client, message);
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      return;
    }

    if (/^[اإآأ]تاح[ةه] المذاكر[ةه]/.test(message.body)) {
      startBookingAvailability();
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();
      const msg = `حجز مواعيد أصبح متاح من الآن وصاعدا`;
      client.sendMessage(message.from, msg);
      return;
    }

    if (/^تعليق حت[ىي]/.test(message.body)) {
      const rePhrase = message.body
        .replace(/\s+/, " ")
        .replace(/^تعليق حت[ىي]/, "")
        .trim()
        .replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (match) =>
          starkString(match).englishNumber().toString()
        );

      const getDate = detectDateFromString(rePhrase);

      if (!getDate) {
        Chat.remove((c) => c.id === isExist.accountId);
        Chat.save();
        const msg = `عذرا التاريخ المطلوب غير واضح رجاء إعادة المحاولة`;
        client.sendMessage(message.from, msg);
        return;
      }

      if (getDate < new Date()) {
        Chat.remove((c) => c.id === isExist.accountId);
        Chat.save();
        const msg = `التاريخ المطلوب انتهى بالفعل ${getDate}`;
        client.sendMessage(message.from, msg);
        return;
      }

      await cancelResFromNowToDate(getDate);

      stopBookingAvailability(getDate);

      Reservation.remove((reservation) => {
        return (
          new Date(reservation.Date) >= new Date() &&
          new Date(reservation.Date) < getDate
        );
      });

      Chat.update((chat) => {
        if (chat.id === isExist.accountId) {
          chat.counter = 2;
          chat.data.date = getDate;
        }
      });
      Chat.save();

      const formattedDate = date.format(getDate);
      const msg = `هل ترغب حقا في تعليق المذاكرة حتى : ${formattedDate}\n\n    ◈ *نعم* \n    ◈ *لا*`;
      client.sendMessage(message.from, msg);
      return;
    }

    const msg = "لم نتمكن من الحصول على إجابة واضحة";
    client.sendMessage(message.from, msg);
    return;
  }

  if (counter === 2) {
    if (
      /نعم|[أاإآ]جل|yes|Yes|Y|y|موافق|بالت[أاإآ]كيد|[أاإآ]كيد|الفعل|[أاإآ]يو[ةه]|صح|حسنا/.test(
        message.body
      )
    ) {
      const reActivationDate = new Date(collectingData.date as Date);
      await cancelResFromNowToDate(reActivationDate);

      Reservation.remove(
        (reservation) =>
          reservation.Date > new Date() && reservation.Date < reActivationDate
      );
      Reservation.save();

      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();

      const msg = `تم تعليق المذاكرة وحذف كافة المواعيد المحجوزة حتى ${date.format(
        reActivationDate
      )}`;
      client.sendMessage(message.from, msg);
      return;
    }

    if (/لا|لأ|كلا|No|no|N|n|غير|[اآإأ]رفض|رافض|/.test(message.body)) {
      Chat.remove((c) => c.id === isExist.accountId);
      Chat.save();

      const reActivationDate = new Date(collectingData.date as Date);
      const msg = `تم التراجع عن تعليق المذاكرة حتى ${date.format(
        reActivationDate
      )}`;
      client.sendMessage(message.from, msg);
      return;
    }

    Chat.remove((c) => c.id === isExist.accountId);
    Chat.save();
    const msg = `إجابة غير واضحة يرجو اختيار\n\n    ◈ *نعم* \n    ◈ *لا*`;
    client.sendMessage(message.from, msg);
  }
};

export default reservationAvailabilityControl;
