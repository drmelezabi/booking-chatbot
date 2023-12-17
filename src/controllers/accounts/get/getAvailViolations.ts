import db from "../../../database/setup";
import SuspendedStudent from "../../../database/suspendedStudent";
import { ISuspendedStudent } from "./getStudentsSuspension";
import { updateCloudStudentViolations } from "../update/updateCloudStudentViolations";
import Avail from "../../../database/avail";
import Reservation from "../../../database/reservation";
import client from "../../../config/whatsapp";
import bookingGroup from "../../GroupManager/getGroup";
import starkString from "starkstring";
import formatDateTime from "../../date/formateTimestamp";
import RegisteredPhone from "../../../database/RegisteredPhone";

const deadline = (date: Date) => {
  const deadline = new Date(date);
  const availPeriodDeadLine =
    (db.get<number>("verifyPickupAvailDeadLine") || 10) * 60 * 1000; // Convert 3 minutes to milliseconds

  deadline.setTime(deadline.getTime() + availPeriodDeadLine);
  return deadline;
};
const editedList: ISuspendedStudent[] = [];

const getAvailViolations = async () => {
  const AvailReservations = Avail.fetchMany(
    (studentCase) => deadline(studentCase.availCreatedDate) > new Date()
  );

  const group = await bookingGroup(client);

  if (AvailReservations.length) {
    const punishmentUnit = db.get<number>("punishmentUnit");

    AvailReservations.map((reservation) => {
      if (!reservation.availId) return false;

      let StudentData: ISuspendedStudent = {
        accountId: reservation.availId,
        ViolationCounter: 0,
        suspensionCase: false,
        BookingAvailabilityDate: new Date(),
        violations: [],
      };

      const studentCase = SuspendedStudent.fetch(
        (studentCase) => studentCase.accountId === reservation.availId
      );

      if (!studentCase) return false;
      const chatId = RegisteredPhone.fetch(
        (std) => std.accountId === reservation.availId
      )!.chatId;

      const punishmentDays =
        (studentCase.ViolationCounter / 2) * punishmentUnit;
      let availCreatedDate = new Date(reservation.availCreatedDate);
      const vio = starkString(studentCase.ViolationCounter + 1)
        .arabicNumber()
        .toString();
      const date = formatDateTime(availCreatedDate);
      availCreatedDate.setDate(availCreatedDate.getDate() + punishmentDays);
      const date2 = formatDateTime(availCreatedDate);

      if (
        studentCase.ViolationCounter >= 2 &&
        studentCase.ViolationCounter % 2 == 0
      ) {
        StudentData = {
          accountId: studentCase.accountId,
          ViolationCounter: studentCase.ViolationCounter + 1,
          suspensionCase: true,
          BookingAvailabilityDate: availCreatedDate,
          violations: [...studentCase.violations, "استجابة لتمرير وعدم تنفيذه"],
        };
        editedList.push(StudentData);
        Avail.remove((avail) => avail.availId === studentCase.accountId);
        Reservation.remove(
          (res) => res.reservationId === reservation.reservationId
        );
        group.sendMessage(
          `بناء على وصول الطالب ${reservation.availName} للمخالفة رقم ${vio} وذلك بتخلفه عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}\n\nوعليه تم تطبيق جزاء بالحرمان من حجز القاعات للمذاكرة حتى يوم ${date2.Day} ${date2.Date} الساعة ${date2.Time}`
        );
        client.sendMessage(
          chatId,
          `بوصولك للمخالفة رقم ${vio} وذلك بالتخلف عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}\n\nوعليه تم تطبيق جزاء بالحرمان من حجز القاعات للمذاكرة حتى يوم ${date2.Day} ${date2.Date} الساعة ${date2.Time}`
        );
      } else {
        StudentData = {
          accountId: studentCase.accountId,
          ViolationCounter: studentCase.ViolationCounter + 1,
          suspensionCase: false,
          BookingAvailabilityDate: availCreatedDate,
          violations: [...studentCase.violations, "استجابة لتمرير وعدم تنفيذه"],
        };
        editedList.push(StudentData);
        Avail.remove((avail) => avail.availId === studentCase.accountId);
        Reservation.remove(
          (res) => res.reservationId === reservation.reservationId
        );
        group.sendMessage(
          `ارتكب الطالب ${reservation.availName} مخالفة رقم ${vio} وذلك بتخلفه عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}`
        );
        client.sendMessage(
          chatId,
          `ارتكب المخالفة رقم ${vio} وذلك بتخلفك عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}`
        );
      }
    });

    Promise.all(
      editedList.map(async (StdCase) => {
        if (StdCase.violations.length) {
          SuspendedStudent.update((account) => {
            if (account.accountId === StdCase.accountId) {
              account.ViolationCounter = StdCase.ViolationCounter;
              account.suspensionCase = StdCase.suspensionCase;
              account.suspensionCase = StdCase.suspensionCase;
              account.BookingAvailabilityDate = StdCase.BookingAvailabilityDate;
            }
          });
          await updateCloudStudentViolations(
            StdCase.accountId,
            StdCase.violations
          );
        }
      })
    );
  }
};

export default getAvailViolations;
