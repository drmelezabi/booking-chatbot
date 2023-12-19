import { doc, updateDoc } from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
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
  try {
    const reservationRef = doc(firestoreDb, "account", accountId);

    await updateDoc(reservationRef, accountData as unknown as object);
    return true;
  } catch (error) {
    throw ErrorHandler(error, "updateCloudAccount");
  }
}
