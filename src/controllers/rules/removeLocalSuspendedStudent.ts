import localDb from "../../config/localDb";
import { ISuspendedStudent } from "./getStudentsSuspension";

const removeLocalSuspendedStudent = async (studentId: string) => {
  try {
    const reservations =
      await localDb.getObject<ISuspendedStudent[]>("/suspendedStudent");

    const filteredReservations = reservations.filter(
      (reservation) => reservation.studentId != studentId
    );
    await localDb.push("/suspendedStudent", filteredReservations, true);
  } catch (error: any) {
    console.log(error.message);
  }
  return true;
};

export default removeLocalSuspendedStudent;
