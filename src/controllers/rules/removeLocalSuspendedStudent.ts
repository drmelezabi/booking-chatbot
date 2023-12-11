import localDb from "../../config/localDb";
import { ISuspendedStudent } from "./getStudentsSuspension";

const removeLocalSuspendedStudent = async (studentId: string) => {
  try {
    const reservations =
      await localDb.getObject<ISuspendedStudent[]>("/suspendedStudent");

    const filteredReservations = reservations.filter(
      (reservation) => reservation.accountId != studentId
    );
    await localDb.push("/suspendedStudent", filteredReservations, true);
    // Save the data (useful if you disable the saveOnPush)
    await localDb.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await localDb.reload();
  } catch (error: any) {
    console.log(error.message);
  }
  return true;
};

export default removeLocalSuspendedStudent;
