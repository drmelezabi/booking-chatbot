import { collection, getDocs, query, where } from "firebase/firestore";
import { firestoreDb } from "../../../config/firebase";

export interface accountData {
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
    console.log("getAccountsString", error);
    return [];
  }
};

export default getAccountsNoFilter;
