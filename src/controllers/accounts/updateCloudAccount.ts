import { updateDoc, doc } from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

export interface studentData {
  admin?: boolean;
  name?: string;
  pass?: string;
  type?: string;
  whatsappId?: string;
}

export async function updateCloudAccount(
  studentId: string,
  studentData: studentData
) {
  const appointmentRef = doc(firestoreDb, "account", studentId);

  try {
    await updateDoc(appointmentRef, studentData as unknown as object);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}
