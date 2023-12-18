import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import prepareBookingMessage from "../../controllers/rules/phraseBookingMessage";
import getStudentViolations from "../../controllers/accounts/get/getStudentViolations";
import checkBookingAvailability from "../../controllers/reservations/check/checkBookingAvailability";
import { arabicMinuets, arabicName, dtOptions } from "../../config/diff";
import { checkRoomAvailability } from "../../controllers/rooms/check/checkRoomIsNotBusy";
import { getDayRangeWithTime } from "../../controllers/date/getDayRangeWithTime";
import formatDateTime from "../../controllers/date/formateTimestamp";
import starkString from "starkstring";
import Reservation from "../../database/reservation";
import RegisteredPhone from "../../database/RegisteredPhone";
import SuspendedStudent from "../../database/suspendedStudent";
import db from "../../database/setup";
import BlockedDates from "../../database/blockedDates";
import createNewReservation from "../../controllers/reservations/add/addReservation";
import bookingGroup from "../../controllers/GroupManager/getGroup";

const addNewReservation = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const isExist = RegisteredPhone.fetch(
    (account) => account.chatId === message.from
  );

  if (!isExist) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
    return;
  }

  if (isExist.type !== "student") {
    client.sendMessage(message.from, "❌ الطالب فقط هو من يملك ميزة الحجز");
    return;
  }

  const studentId = isExist.accountId;

  const suspension = SuspendedStudent.fetch((account) => {
    return (
      account.accountId === isExist.accountId && account.suspensionCase === true
    );
  });

  if (suspension) {
    await getStudentViolations(studentId);
    if (suspension && suspension.suspensionCase) {
      const dt = suspension.BookingAvailabilityDate;
      const sticker = MessageMedia.fromFilePath("./src/imgs/rejected.png");
      client.sendMessage(message.from, sticker, {
        sendMediaAsSticker: true,
      });
      const msg = `🚫 **يبدو أنك موقوف عن حجز قاعات المذاكرة** 🚫\n\nتم تجاوز عدد المرات المسموحة للمخالفات، حيث بلغ عدد المخالفات الخاصة بك ${
        suspension.ViolationCounter
      } مرات.\nتاريخ انتهاء الإيقاف: ${dt.toLocaleDateString(
        "ar-EG",
        dtOptions
      )}
      `;
      client.sendMessage(message.from, msg);
      return;
    }
  }

  const existedRes = Reservation.fetch(
    (account) => account.accountId === studentId
  );

  if (existedRes) {
    const sticker = MessageMedia.fromFilePath("./src/imgs/project-status.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    const dtFormat = new Date(existedRes.Date).toLocaleDateString(
      "ar-EG",
      dtOptions
    );
    const msg = `🕒 **يمكنك حجز موعد جديد بعد انتهاء موعد الحجز الساري الخاص بك** 🕒\n\nموعد الحجز الساري هو: ${dtFormat}`;
    client.sendMessage(message.from, msg);
    return;
  }

  const BookingIsAvailable = await checkBookingAvailability();
  if (typeof BookingIsAvailable === "string") {
    const sticker = MessageMedia.fromFilePath("./src/imgs/weather-alert.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    client.sendMessage(message.from, BookingIsAvailable);
    return;
  }
  let restOfString: string = message.body.substring("!حجز".length);
  const { day, room, time } = await prepareBookingMessage(restOfString);
  console.log({ time });
  if (!day || !time || !room) {
    const info: string[] = [];
    if (!day) info.push("اليوم");
    if (!time) info.push("التوقيت");
    if (!room) info.push("القاعة");

    const msg = `❓ **معلومات ${info.join(" و ")} غير واضحة** ❓\n\nببساطة، ${
      isExist.gender === "male" ? "حاول" : "حاولي"
    } التعبير عن هذه المعلومات`;
    const sticker = MessageMedia.fromFilePath("./src/imgs/lost.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    client.sendMessage(message.from, msg);
    return;
  }

  const blockedDates = BlockedDates.fetchAll();
  type dayType = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  const blockedDays = db.get<dayType>("blockedDays");
  const bookingOpen = db.get<number>("bookingOpen");
  const bookingClose = db.get<number>("bookingClose");
  const maxTimeToBookAfterItsStartInMin = db.get<number>(
    "maxTimeToBookAfterItsStartInMin"
  );

  if (blockedDays.includes(day)) {
    const msg = `يوم ${arabicName[day]} ليس من ضمن الأيام المتاحة للحجز`;
    const sticker = MessageMedia.fromFilePath("./src/imgs/lost.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    client.sendMessage(message.from, msg);
    return;
  }

  const stamp = getDayRangeWithTime(day, time);
  const open = `${starkString(
    bookingOpen > 12 ? bookingOpen - 12 : bookingOpen
  ).arabicNumber()} ${bookingOpen > 12 ? "م" : "ص"}`;
  if (typeof stamp === "number") {
    let msg = "";
    if (stamp === 1)
      msg = `⏰ **عذرًا، يبدو أن موعد الحجز المطلوب قبل مواعيد العمل بالكلية** ⏰\nتبدأ فترات المذاكرة من: ${open}`;
    else if (stamp === 2)
      msg = `📅 **يبدو أن مواعيد الحجز لليوم المطلوب غير متاحة في الأسبوع الحالي** 📅\n\nيمكنك اختيار موعد خلال الفترة المتبقية المتاحة من الأسبوع الحالي\nأو الانتظار حتى نهاية يوم الخميس ليصبح الحجز للأسبوع التالي متاح`;
    const sticker = MessageMedia.fromFilePath("./src/imgs/fence.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    client.sendMessage(message.from, msg);
    return;
  }

  const { start, end } = stamp;

  const isBlockedDate = blockedDates.filter((d) => {
    const dt = new Date(d.date);
    const IsNotAvailable =
      dt.getDate() === start.getDate() &&
      dt.getMonth() === start.getMonth() &&
      (d.annually || dt.getFullYear() === start.getFullYear());
    return IsNotAvailable;
  });

  // Create a copy of the current date to avoid modification
  const dayStarts = new Date(start);
  const dayEnds = new Date(end);

  // Set the time of the copied date to 17:00 (5:00 PM)
  dayStarts.setHours(bookingOpen, 0, 0, 0);
  dayEnds.setHours(bookingClose, 0, 0, 0); // setHours(hours, minutes, seconds, milliseconds)

  if (end > dayEnds) {
    console.log({ end, dayEnds });
    const sticker = MessageMedia.fromFilePath("./src/imgs/project-status.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    const dtFormat = dayEnds.toLocaleDateString("ar-EG", {
      timeZone: "Africa/Cairo",
      hour: "numeric",
      hour12: true,
    });
    const msg = `🚫 **عذرًا، يبدو أنك اخترت موعدًا بعد الحد الأقصى المحدد من قبل الجامعة** 🚫\n\nموعد الحد الأقصى هو: ${
      dtFormat.split(",")[1]
    }`;
    client.sendMessage(message.from, msg);
    return;
  }

  if (isBlockedDate.length) {
    const msg = `🗓️ **يوم ${arabicName[day]} المطلوب غير متاح للمذاكرة** 🗓️\n\nالسبب: ${isBlockedDate[0].reason}`;
    const sticker = MessageMedia.fromFilePath("./src/imgs/rules.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    client.sendMessage(message.from, msg);
    return;
  }

  const now = new Date();
  if (now.getMinutes() > 30) dayStarts.setHours(now.getHours(), 30, 0, 0);
  if (now.getMinutes() < 30) dayStarts.setHours(now.getHours(), 0, 0, 0);

  let maxAfterStarts = arabicMinuets(maxTimeToBookAfterItsStartInMin);

  if (
    new Date().getHours() === now.getHours() &&
    new Date().getMinutes() - now.getMinutes() > maxTimeToBookAfterItsStartInMin
  ) {
    const msg = `⏰ **يبدو أنه قد مر وقت يزيد عن ${maxAfterStarts} دقيقة ولم يعد الموعد متاحًا للحجز** ⏰\n\ ${
      isExist.gender === "male" ? "حاول" : "حاولي"
    } حجز المواعيد قبل بدء الحجز بوقت كافٍ`;
    client.sendMessage(message.from, msg);
    return;
  }

  const isAvailableRoom = await checkRoomAvailability(room, start);
  if (!isAvailableRoom) {
    const msg = `🚪 **الغرفة ${room} مشغولة في الوقت المطلوب** 🚪\n\nيمكنك الاطلاع على المواعيد المحجوزة لتفادي هذه المواعيد`;
    const sticker = MessageMedia.fromFilePath("./src/imgs/busy.png");
    client.sendMessage(message.from, sticker, {
      sendMediaAsSticker: true,
    });
    client.sendMessage(message.from, msg);
    return;
  }

  await createNewReservation({
    case: 0,
    room,
    start,
    stdId: studentId,
    student: isExist.name,
  });

  const dt = formatDateTime(start);
  const succeedMsg = `🌟 *تمت عملية الحجز بنجاح!* 🌟

*يوم:* ${arabicName[day]}
*تاريخ:* ${dt.Date}
*التوقيت:* ${dt.Time}
*الغرفة:* ${starkString(room).arabicNumber().toString()}

ننتظر منك الالتزام بالحضور في الموعد وسرعة تنشيط الحجز مع المشرف. 🕒`;
  const sticker = MessageMedia.fromFilePath("./src/imgs/calendar.png");
  client.sendMessage(message.from, sticker, {
    sendMediaAsSticker: true,
  });
  client.sendMessage(message.from, `${succeedMsg}`);
  const group = await bookingGroup(client);
  group.sendMessage(
    `قام الطالب ${isExist.name} بحجز الموعد التالي\n*يوم:* ${
      arabicName[day]
    }\n*تاريخ:* ${dt.Date}\n*التوقيت:* ${dt.Time}\n*الغرفة:* ${starkString(room)
      .arabicNumber()
      .toString()}`
  );
};
export default addNewReservation;
