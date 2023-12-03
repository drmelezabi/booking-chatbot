import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

export interface studentData {
  admin: boolean;
  name: string;
  pass: string;
  type: string;
  whatsappId: string;
  violations: string[];
}

const getStudentIdByPass = async (
  studentPass: string
): Promise<string | null> => {
  try {
    const finalData: DocumentData = [];

    const q = query(
      collection(firestoreDb, "account"),
      where("pass", "==", studentPass)
    );

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      finalData.push(doc.id);
    });

    return finalData[0] as string;
  } catch (error) {
    console.log("getStudentIdByPass", error);
    return null;
  }
};

export default getStudentIdByPass;
