import { doc, getDoc } from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

export interface accountData {
  admin: boolean;
  name: string;
  pass: string;
  type: "student" | "teacher" | "security" | "employee" | undefined;
  whatsappId: string;
  violations: string[];
}

const getCloudAccount = async (
  studentId: string
): Promise<accountData | null> => {
  try {
    const appointmentRef = doc(firestoreDb, "account", studentId);
    const accountData = (await getDoc(appointmentRef)).data() ?? null;
    return accountData as accountData | null;
  } catch (error) {
    console.log("getStudent", error);
    return null;
  }
};

export default getCloudAccount;
