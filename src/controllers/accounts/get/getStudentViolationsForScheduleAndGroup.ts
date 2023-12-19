import { doc, writeBatch } from "firebase/firestore";
import starkString from "starkstring";

import { ISuspendedStudent } from "./getStudentsSuspension";
import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";
import client from "../../../config/whatsapp";
import RegisteredPhone from "../../../database/RegisteredPhone";
import Reservation from "../../../database/reservation";
import db from "../../../database/setup";
import SuspendedStudent from "../../../database/suspendedStudent";
import formatDateTime from "../../date/formateTimestamp";
import bookingGroup from "../../GroupManager/getGroup";

const getStudentViolationsForScheduleAndGroup = async () => {
  try {
    const reservations = Reservation.fetchMany(
      (reservation) => new Date() > new Date(reservation.Date)
    );
    const punishmentUnit = db.get<number>("punishmentUnit");

    const editedList: ISuspendedStudent[] = [];

    if (reservations.length) {
      const group = await bookingGroup(client);

      const batch = writeBatch(firestoreDb);

      Promise.all(
        reservations.map(async (reservation) => {
          const studentCase = SuspendedStudent.fetch(
            (studentCase) => studentCase.accountId === reservation.accountId
          );

          if (!studentCase)
            throw new Error("studentCase should not be nullable");

          const student = RegisteredPhone.fetch(
            (account) => account.accountId === reservation.accountId
          );
          if (!student) return false;

          const resDate = new Date(reservation.Date);
          const vio = starkString(studentCase.ViolationCounter + 1)
            .arabicNumber()
            .toString();
          const date = formatDateTime(resDate);

          if (
            studentCase.ViolationCounter >= 2 &&
            studentCase.ViolationCounter % 2 == 0
          ) {
            const punishmentDays =
              (studentCase.ViolationCounter / 2) * punishmentUnit;
            reservation.Date.setDate(
              reservation.Date.getDate() + punishmentDays
            );
            const violations = [
              ...studentCase.violations,
              "Reservation not used",
            ];
            editedList.push({
              accountId: reservation.accountId,
              ViolationCounter: studentCase.ViolationCounter + 1,
              suspensionCase: true,
              BookingAvailabilityDate: reservation.Date,
              violations,
            });

            const date = formatDateTime(resDate);
            const availability = formatDateTime(reservation.Date);

            const sfRef = doc(firestoreDb, "account", reservation.accountId);
            batch.update(sfRef, { violations });

            await group.sendMessage(
              `بناء على وصول الطالب ${student.name} للمخالفة رقم ${vio} وذلك بتخلفه عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}\n\nوعليه تم تطبيق جزاء بالحرمان من حجز القاعات للمذاكرة حتى يوم ${availability.Day} ${availability.Date} الساعة ${availability.Time}`
            );
            client.sendMessage(
              student.chatId,
              `بوصولك للمخالفة رقم ${vio} وذلك بالتخلف عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}\n\nوعليه تم تطبيق جزاء بالحرمان من حجز القاعات للمذاكرة حتى يوم ${availability.Day} ${availability.Date} الساعة ${availability.Time}`
            );
          } else {
            const violations = [
              ...studentCase.violations,
              "Reservation not used",
            ];

            editedList.push({
              accountId: reservation.accountId,
              ViolationCounter: studentCase.ViolationCounter + 1,
              suspensionCase: false,
              BookingAvailabilityDate: reservation.Date,
              violations,
            });

            const sfRef = doc(firestoreDb, "account", reservation.accountId);
            batch.update(sfRef, { violations });

            client.sendMessage(
              db.get<string>("groupId"),
              `ارتكب الطالب ${student.name} مخالفة رقم ${vio} وذلك بتخلفه عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}`
            );
            client.sendMessage(
              student.chatId,
              `ارتكب المخالفة رقم ${vio} وذلك بتخلفك عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}`
            );
          }
        })
      );

      if (editedList.length) {
        editedList.map((stdCase) => {
          if (stdCase.violations.length) {
            SuspendedStudent.update((account) => {
              if (account.accountId === stdCase.accountId) {
                account.ViolationCounter = stdCase.ViolationCounter;
                account.suspensionCase = stdCase.suspensionCase;
                account.suspensionCase = stdCase.suspensionCase;
                account.BookingAvailabilityDate =
                  stdCase.BookingAvailabilityDate;
              }
            });
          }
        });
      }

      await batch.commit();
    }
  } catch (error) {
    throw ErrorHandler(error, "getStudentViolationsForScheduleAndGroup");
  }
};

export default getStudentViolationsForScheduleAndGroup;
