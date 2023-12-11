import { updateDoc, doc } from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

// Assuming you've initialized Firestore with `firestoreDb`

interface IAppointment {
  case?: number;
  room?: string;
  start?: Date;
  stdId?: string;
  student?: string;
  supervisor?: string;
}

export async function updateCloudAppointmentById(
  appointmentId: string,
  appointment: IAppointment
) {
  const appointmentRef = doc(firestoreDb, "appointment", appointmentId);

  try {
    if (Object.keys(appointment).length > 0)
      await updateDoc(appointmentRef, appointment as { [key: string]: any });
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}
