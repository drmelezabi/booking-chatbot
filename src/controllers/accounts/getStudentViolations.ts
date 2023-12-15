import Reservation from "../../database/reservation";
import db from "../../database/setup";
import SuspendedStudent from "../../database/suspendedStudent";
import { ISuspendedStudent } from "../rules/getStudentsSuspension";
import { updateCloudStudentViolations } from "./updateCloudStudentViolations";

const getStudentViolations = async (accountId: string) => {
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

    reservations
      .filter(
        (reservation) =>
          reservation.accountId === accountId &&
          new Date(reservation.Date) < new Date()
      )
      .map((reservation) => {
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
        } else {
          EditedStudentData = {
            accountId: accountId,
            ViolationCounter: studentCase.ViolationCounter + 1,
            suspensionCase: false,
            BookingAvailabilityDate: reservation.Date,
            violations: [...studentCase.violations, "Reservation not used"],
          };
        }
      });

    if (EditedStudentData.violations.length) {
      SuspendedStudent.update((account) => {
        if (account.accountId === accountId) {
          account.ViolationCounter = EditedStudentData.ViolationCounter;
          account.suspensionCase = EditedStudentData.suspensionCase;
          account.suspensionCase = EditedStudentData.suspensionCase;
          account.BookingAvailabilityDate =
            EditedStudentData.BookingAvailabilityDate;
        }
      });
      await updateCloudStudentViolations(
        accountId,
        EditedStudentData.violations
      );
    }
  }
};

export default getStudentViolations;
