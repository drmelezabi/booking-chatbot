import { updateDoc, doc } from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

// Assuming you've initialized Firestore with `firestoreDb`

export async function updateAppointmentCaseById(
  appointmentId: string,
  appointmentCase: number
) {
  const appointmentRef = doc(firestoreDb, "appointment", appointmentId);

  try {
    await updateDoc(appointmentRef, { case: appointmentCase });
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}
