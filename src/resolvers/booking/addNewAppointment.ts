import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import getAccountByChatId from "../../controllers/accounts/getStudentByChatId";
import prepareBookingMessage from "../../controllers/rules/phraseBokkingmessage";
import getStudentsSuspension from "../../controllers/rules/getStudentsSuspension";
import getStudentViolations from "../../controllers/accounts/getStudentViolations";
import getLocalReservations from "../../controllers/rules/getLocalReservations";
import checkBookingAvailability from "../../controllers/rules/checkBookingAvailability";
import { dtOptions } from "../../config/diff";
import { checkRoomAvailability } from "../../controllers/rooms/checkRoomIsNotBusy";

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
          const dtFormmat = existedRes[0].Date.toLocaleDateString(
            "ar-EG",
            dtOptions
          );
          const msg = `يمكنك حجز موعد جديد بعد انتهاء موعد الحجز الساري الخاص بك\nموعد الحجز الساري هو:\n${dtFormmat}`;
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
            const preparedMessages = prepareBookingMessage(restOfString);
            const { day, room, time } = preparedMessages;

            if (!day || !time || !room) {
              const sticker = MessageMedia.fromFilePath("./src/imgs/lost.png");
              await client.sendMessage(message.from, sticker, {
                sendMediaAsSticker: true,
              });
              client;
              client.sendMessage(
                message.from,
                " أحد المعلومات غير واضحة برجاء توضيح الموعد واليوم والقاعة"
              );
            } else {
              const roomAvailability = await checkRoomAvailability(
                preparedMessages.room,
                new Date(``)
              );

              client.sendMessage(
                message.from,
                `Day:${preparedMessages.day}\nTime:${preparedMessages.time}\nRoom:${preparedMessages.room}`
              );

              // if (reservations.length) {
              // } else {
              //   // client.sendMessage(
              //   //   message.from,
              //   //   `🟢 *لا يوجد أي حجز خلال الأسبوع حتى الآن*`
              //   // );
              // }
            }
          }
        }
      }
    }
  }
};

export default addNewAppointment;
