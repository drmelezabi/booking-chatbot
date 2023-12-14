import { updateDoc, doc } from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

export interface accountData {
  permissions?: "user" | "admin" | "superAdmin";
  name?: string;
  fullName?: string;
  pass?: string;
  type?: string;
  whatsappId?: string;
}

export async function updateCloudAccount(
  accountId: string,
  accountData: accountData
) {
  const appointmentRef = doc(firestoreDb, "account", accountId);

  try {
    await updateDoc(appointmentRef, accountData as unknown as object);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}
