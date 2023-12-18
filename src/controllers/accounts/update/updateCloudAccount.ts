import { doc, updateDoc } from "firebase/firestore";

import { firestoreDb } from "../../../config/firebase";

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
  const reservationRef = doc(firestoreDb, "account", accountId);

  try {
    await updateDoc(reservationRef, accountData as unknown as object);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}
