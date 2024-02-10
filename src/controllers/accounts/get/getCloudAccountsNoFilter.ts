import { collection, getDocs, query } from "firebase/firestore";

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

const getAccountsNoFilter = async (): Promise<accountData[]> => {
  try {
    const finalData: accountData[] = [];

    const q = query(collection(firestoreDb, "account"));

    const docSnap = await getDocs(q);

    docSnap.forEach((doc) => {
      finalData.push(doc.data() as accountData);
    });

    if (!finalData.length) return [];

    return finalData;
  } catch (error) {
    throw ErrorHandler(error, "getAccountsNoFilter");
  }
};

export default getAccountsNoFilter;
