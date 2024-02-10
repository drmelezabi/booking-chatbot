import { collection, getDocs, query, where } from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";

interface accountData {
  permissions: "user" | "admin" | "superAdmin";
  name: string;
  fullName: string;
  pass: string;
  type: string;
  whatsappId: string;
}

const getAccounts = async (
  type: "teacher" | "student" | "manager" | "security"
): Promise<accountData[]> => {
  try {
    const finalData: accountData[] = [];

    const q = query(
      collection(firestoreDb, "account"),
      where("type", "==", type)
    );

    const docSnap = await getDocs(q);

    docSnap.forEach((doc) => {
      finalData.push(doc.data() as accountData);
    });

    if (!finalData.length) return [];

    return finalData;
  } catch (error) {
    throw ErrorHandler(error, "getAccounts");
  }
};

export default getAccounts;
