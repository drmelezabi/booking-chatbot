import { updateDoc, doc } from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

export async function updateCloudStudentViolations(
  studentId: string,
  violations: string[]
) {
  const appointmentRef = doc(firestoreDb, "account", studentId);

  try {
    await updateDoc(appointmentRef, { violations });
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}
