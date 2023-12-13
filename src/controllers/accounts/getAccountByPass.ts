import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

const getAccountIdByPass = async (pass: string): Promise<string> => {
  try {
    const finalData: DocumentData = [];

    const q = query(
      collection(firestoreDb, "account"),
      where("pass", "==", pass)
    );

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      finalData.push(doc.id);
    });

    const array = finalData[0] as string;

    return array;
  } catch (error) {
    console.log("getAccountIdByPass", error);
    return "";
  }
};

export default getAccountIdByPass;
