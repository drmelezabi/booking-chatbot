import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";

interface studentData {
  permissions: "user" | "admin" | "superAdmin";
  name: string;
  fullName: string;
  pass: string;
  gender: "male" | "female";
  type: "student" | "teacher" | "security" | "manager";
  whatsappId: string;
  violations: string[];
}

const getCloudStudentIdByPass = async (
  studentPass: string
): Promise<{ id: string; data: studentData } | null> => {
  try {
    const finalData: DocumentData = [];

    const q = query(
      collection(firestoreDb, "account"),
      where("pass", "==", studentPass)
    );

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      finalData.push({ id: doc.id, data: doc.data() });
    });

    if (!finalData.length) return null;

    return finalData[0] as { id: string; data: studentData };
  } catch (error) {
    throw ErrorHandler(error, "getCloudStudentIdByPass");
  }
};

export default getCloudStudentIdByPass;
