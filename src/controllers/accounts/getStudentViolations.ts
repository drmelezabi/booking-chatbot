import addLocalSuspendedStudents from "../rules/addLocalSuspendedStudents";
import getLocalReservations from "../rules/getLocalReservations";
import getPunishmentUnit from "../rules/getPunishment";
import getStudentsSuspension, {
  ISuspendedStudent,
} from "../rules/getStudentsSuspension";
import removeLocalSuspendedStudent from "../rules/removeLocalSuspendedStudent";
import getStudent from "./getStudent";
import { updateCloudStudentViolations } from "./updateCloudStudentViolations";

const getStudentViolations = async (studentId: string) => {
  const reservations = await getLocalReservations();
  const suspendedStudent = await getStudentsSuspension();

  const studentCase = suspendedStudent.filter(
    (studentCase) => studentCase.studentId === studentId
  )[0];

  let EditedStudentData: ISuspendedStudent = {
    studentId: studentId,
    ViolationCounter: 0,
    suspensionCase: false,
    BookingAvailabilityDate: new Date(),
    violations: [],
  };

  if (reservations.length) {
    const punishmentUnit = await getPunishmentUnit();
    reservations
      .filter(
        (reservation) =>
          reservation.studentId === studentId &&
          new Date(reservation.Date) < new Date()
      )
      .map((reservation) => {
        if (
          studentCase.ViolationCounter >= 2 &&
          studentCase.ViolationCounter % 2 == 0
        ) {
          const punishmentDays =
            (studentCase.ViolationCounter / 2) * punishmentUnit;
          // get "BookingAvailabilityDate"
          reservation.Date.setDate(reservation.Date.getDate() + punishmentDays);
          EditedStudentData = {
            studentId: studentId,
            ViolationCounter: studentCase.ViolationCounter + 1,
            suspensionCase: true,
            BookingAvailabilityDate: reservation.Date,
            violations: [...studentCase.violations, "Reservation not used"],
          };
        } else {
          EditedStudentData = {
            studentId: studentId,
            ViolationCounter: studentCase.ViolationCounter + 1,
            suspensionCase: false,
            BookingAvailabilityDate: reservation.Date,
            violations: [...studentCase.violations, "Reservation not used"],
          };
        }
      });

    if (EditedStudentData.violations.length) {
      await removeLocalSuspendedStudent(studentId);
      await addLocalSuspendedStudents(EditedStudentData);
      const studentDate = (await getStudent(studentId))!;
      await updateCloudStudentViolations(
        studentDate.id,
        EditedStudentData.violations
      );
    }
  }
};

export default getStudentViolations;
