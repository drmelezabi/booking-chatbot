import { doc, getDoc } from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";

interface accountData {
  permissions: "user" | "admin" | "superAdmin";
  name: string;
  pass: string;
  fullName: string;
  gender: "male" | "female";
  type: "student" | "teacher" | "security" | "employee" | undefined;
  whatsappId: string;
  violations: string[];
}

const getCloudAccount = async (
  studentId: string
): Promise<accountData | null> => {
  try {
    const reservationRef = doc(firestoreDb, "account", studentId);
    const accountData = (await getDoc(reservationRef)).data() ?? null;
    return accountData as accountData | null;
  } catch (error) {
    throw ErrorHandler(error, "getCloudAccount");
  }
};

export default getCloudAccount;
