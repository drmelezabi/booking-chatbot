import localDb from "../../config/localDb";
import { ISuspendedStudent } from "./getStudentsSuspension";

const addLocalSuspendedStudents = async (
  suspendedStudentData: ISuspendedStudent
) => {
  try {
    localDb.push("/suspendedStudent[]", suspendedStudentData, false);
    // Save the data (useful if you disable the saveOnPush)
    await localDb.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await localDb.reload();
    return;
  } catch (error: any) {
    console.log(error.message);
  }
};

export default addLocalSuspendedStudents;
