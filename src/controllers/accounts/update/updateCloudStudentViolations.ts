import { doc, updateDoc } from "firebase/firestore";

import { firestoreDb } from "../../../config/firebase";

export async function updateCloudStudentViolations(
  studentId: string,
  violations: string[]
) {
  const reservationRef = doc(firestoreDb, "account", studentId);

  try {
    await updateDoc(reservationRef, { violations });
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}
