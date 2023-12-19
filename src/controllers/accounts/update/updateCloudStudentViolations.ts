import { doc, updateDoc } from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";

export async function updateCloudStudentViolations(
  studentId: string,
  violations: string[]
) {
  try {
    const reservationRef = doc(firestoreDb, "account", studentId);

    await updateDoc(reservationRef, { violations });
    return true;
  } catch (error) {
    throw ErrorHandler(error, "updateCloudStudentViolations");
  }
}
