import localDb from "../../config/localDb";
import { ISuspendedStudent } from "./getStudentsSuspension";

const addLocalSuspendedStudents = async (
  suspendedStudentData: ISuspendedStudent
) => {
  return new Promise((resolve, reject) => {
    try {
      const rulesData = localDb.push(
        "/suspendedStudent[]",
        suspendedStudentData,
        false
      );
      resolve(rulesData);
      return;
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default addLocalSuspendedStudents;
