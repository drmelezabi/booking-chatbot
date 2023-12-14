import WAWebJS, { MessageSendOptions, Contact } from "whatsapp-web.js";
import Reservation from "../../database/reservation";
import db from "../../database/setup";
import SuspendedStudent from "../../database/suspendedStudent";
import bookingGroup from "../GroupManager/getGroup";
import { ISuspendedStudent } from "../rules/getStudentsSuspension";
import { updateCloudStudentViolations } from "./updateCloudStudentViolations";
import RegisteredPhone from "../../database/RegisteredPhone";
import starkString from "starkstring";
import formatDateTime from "../date/formateTimestamp";

const getStudentViolationsForScheduleAndGroup = async (
  accountId: string,
  client: WAWebJS.Client
) => {
  const reservations = Reservation.fetchAll();
  const studentCase = SuspendedStudent.fetch(
    (studentCase) => studentCase.accountId === accountId
  );

  if (!studentCase) return false;

  let EditedStudentData: ISuspendedStudent = {
    accountId: accountId,
    ViolationCounter: 0,
    suspensionCase: false,
    BookingAvailabilityDate: new Date(),
    violations: [],
  };

  if (reservations.length) {
    const punishmentUnit = db.get<number>("punishmentUnit");

    const filteredReservations = reservations.filter(
      (reservation) =>
        reservation.accountId === accountId &&
        new Date(reservation.Date) < new Date()
    );
    const student = RegisteredPhone.fetch(
      (account) => account.accountId === accountId
    )!;
    const group = await bookingGroup(client);

    Promise.all(
      filteredReservations.map(async (reservation) => {
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
          reservation.Date.setDate(reservation.Date.getDate() + punishmentDays);
          EditedStudentData = {
            accountId: accountId,
            ViolationCounter: studentCase.ViolationCounter + 1,
            suspensionCase: true,
            BookingAvailabilityDate: reservation.Date,
            violations: [...studentCase.violations, "Reservation not used"],
          };

          const date = formatDateTime(resDate);
          const availability = formatDateTime(reservation.Date);

          await group.sendMessage(
            `بناء على وصول الطالب ${student.name} للمخالفة رقم ${vio} وذلك بتخلفه عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}\n\nوعليه تم تطبيق جزاء بالحرمان من حجز القاعات للمذاكرة حتى يوم ${availability.Day} ${availability.Date} الساعة ${availability.Time}`
          );
          client.sendMessage(
            student.chatId,
            `بوصولك للمخالفة رقم ${vio} وذلك بالتخلف عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}\n\nوعليه تم تطبيق جزاء بالحرمان من حجز القاعات للمذاكرة حتى يوم ${availability.Day} ${availability.Date} الساعة ${availability.Time}`
          );
        } else {
          EditedStudentData = {
            accountId: accountId,
            ViolationCounter: studentCase.ViolationCounter + 1,
            suspensionCase: false,
            BookingAvailabilityDate: reservation.Date,
            violations: [...studentCase.violations, "Reservation not used"],
          };

          await group.sendMessage(
            `ارتكب الطالب ${student.name} مخالفة رقم ${vio} وذلك بتخلفه عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}`
          );
          client.sendMessage(
            student.chatId,
            `ارتكب المخالفة رقم ${vio} وذلك بتخلفك عن الحضور في الموعد يوم${date.Day} ${date.Date} الساعة ${date.Time}`
          );
        }
      })
    );

    if (EditedStudentData.violations.length) {
      SuspendedStudent.remove((account) => account.accountId === accountId);
      SuspendedStudent.save();
      SuspendedStudent.create(EditedStudentData);
      SuspendedStudent.save();
      await updateCloudStudentViolations(
        accountId,
        EditedStudentData.violations
      );
    }
  }
};

export default getStudentViolationsForScheduleAndGroup;
