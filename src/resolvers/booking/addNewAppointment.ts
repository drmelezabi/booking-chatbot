import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import getAccountByChatId from "../../controllers/accounts/getStudentByChatId";
import prepareBookingMessage from "../../controllers/rules/phraseBokkingmessage";
import getStudentsSuspension from "../../controllers/rules/getStudentsSuspension";
import getStudentViolations from "../../controllers/accounts/getStudentViolations";
import getLocalReservations from "../../controllers/rules/getLocalReservations";
import checkBookingAvailability from "../../controllers/rules/checkBookingAvailability";
import { arabicName, dtOptions } from "../../config/diff";
import { checkRoomAvailability } from "../../controllers/rooms/checkRoomIsNotBusy";
import { getDayRangeWithTime } from "../../controllers/date/getDayRangeWithTime";
import getRules from "../../controllers/rules/getRules";
import createNewAppointment from "../../controllers/rooms/addAppointment";
import formatDateTime from "../../controllers/date/formateTimestamp";
import starkString from "starkstring";

const addNewAppointment = async (
  client: WAWebJS.Client,
  message: WAWebJS.Message
) => {
  const isExist = await getAccountByChatId(message.from);
  if (isExist === null) {
    client.sendMessage(message.from, "❌ أنت تستخدم هاتف غير موثق");
  } else {
    if (isExist.type !== "student") {
      client.sendMessage(message.from, "❌ الطالب فقط هو من يملك ميزة الحجز");
    } else {
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
      } else {
        const existedRes = (await getLocalReservations()).filter(
          (std) => std.studentId === studentId
        );
        if (existedRes.length) {
          const sticker = MessageMedia.fromFilePath(
            "./src/imgs/project-status.png"
          );
          client.sendMessage(message.from, sticker, {
            sendMediaAsSticker: true,
          });
          const dtFormat = existedRes[0].Date.toLocaleDateString(
            "ar-EG",
            dtOptions
          );
          const msg = `يمكنك حجز موعد جديد بعد انتهاء موعد الحجز الساري الخاص بك\nموعد الحجز الساري هو:\n${dtFormat}`;
          client.sendMessage(message.from, msg);
        } else {
          const BookingIsAvailable = await checkBookingAvailability();
          if (typeof BookingIsAvailable === "string") {
            const sticker = MessageMedia.fromFilePath(
              "./src/imgs/weather-alert.png"
            );
            client.sendMessage(message.from, sticker, {
              sendMediaAsSticker: true,
            });
            client.sendMessage(message.from, BookingIsAvailable);
          } else {
            let restOfString: string = message.body.substring("!حجز".length);
            const { day, room, time } =
              await prepareBookingMessage(restOfString);

            if (!day || !time || !room) {
              const msg =
                " أحد المعلومات غير واضحة برجاء توضيح الموعد واليوم والقاعة";
              const sticker = MessageMedia.fromFilePath("./src/imgs/lost.png");
              client.sendMessage(message.from, sticker, {
                sendMediaAsSticker: true,
              });
              client.sendMessage(message.from, msg);
            } else {
              const stamp = await getDayRangeWithTime(day, time);
              if (typeof stamp === "number") {
                let msg = "";
                if (stamp === 1)
                  msg = "يبدو أن موعد الحجز المطلوب قبل مواعيد العمل بالكلية";
                else if (stamp === 2)
                  msg = `يبدو أن مواعيد الحجز لليوم المطلوب غير متاحة في الاسبوع الحالي\n\nيمكنك اختيار موعد خلال الفترة المتبقية المتاحة من الأسبوع الحالي\nأو الانتظار حتى نهاية يوم الخميس  حتى يصبح الحجز للأسبوع التالي متاح`;
                const sticker = MessageMedia.fromFilePath(
                  "./src/imgs/fence.png"
                );
                client.sendMessage(message.from, sticker, {
                  sendMediaAsSticker: true,
                });
                client.sendMessage(message.from, msg);
              } else {
                const { blockedDays, blockedDates } = await getRules();
                if (blockedDays.includes(day)) {
                  const msg = `يوم ${arabicName[day]} ليس من ضمن الأيام المتاحة للحجز`;
                  const sticker = MessageMedia.fromFilePath(
                    "./src/imgs/lost.png"
                  );
                  client.sendMessage(message.from, sticker, {
                    sendMediaAsSticker: true,
                  });
                  client.sendMessage(message.from, msg);
                } else {
                  const { start } = stamp;
                  const isBlockedDate = blockedDates.filter((d) => {
                    const IsNotAvailable =
                      d.date.getDate() === start.getDate() &&
                      d.date.getMonth() === start.getMonth() &&
                      (d.annually ||
                        d.date.getFullYear() === start.getFullYear());
                    return IsNotAvailable;
                  });
                  if (isBlockedDate.length) {
                    const msg = `يوم ${arabicName[day]} المطلوب ليس من ضمن الأيام المتاحة للمذاكرة\nوالسبب : ${isBlockedDate[0].reason}`;
                    const sticker = MessageMedia.fromFilePath(
                      "./src/imgs/rules.png"
                    );
                    client.sendMessage(message.from, sticker, {
                      sendMediaAsSticker: true,
                    });
                    client.sendMessage(message.from, msg);
                  } else {
                    const isAvailableRoom = await checkRoomAvailability(
                      room,
                      start
                    );
                    if (!isAvailableRoom) {
                      const msg = `الغرفة ${room} مشغولة في الوقت المطلوب\nيمكنك الاطلاع على المواعيد المحجوزة لتفادي هذه المواعيد`;
                      const sticker = MessageMedia.fromFilePath(
                        "./src/imgs/busy.png"
                      );
                      client.sendMessage(message.from, sticker, {
                        sendMediaAsSticker: true,
                      });
                      client.sendMessage(message.from, msg);
                    } else {
                      await createNewAppointment({
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

ننتظر منك الالتزام بالحضور في الموعد وسرعة تنشيط الحجز مع المشرف. 🕒
                      `;
                      const sticker = MessageMedia.fromFilePath(
                        "./src/imgs/calendar.png"
                      );
                      client.sendMessage(message.from, sticker, {
                        sendMediaAsSticker: true,
                      });
                      client.sendMessage(message.from, `${succeedMsg}`);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export default addNewAppointment;
