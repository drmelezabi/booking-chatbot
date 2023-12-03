import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

export interface studentData {
  id: string;
  admin: boolean;
  name: string;
  pass: string;
  type: string;
  violations: string[];
}

const getStudent = async (studentId: string): Promise<studentData | null> => {
  try {
    const appointmentRef = doc(firestoreDb, "account", studentId);
    const studentData = (await getDoc(appointmentRef)).data() ?? null;
    return studentData as studentData | null;
  } catch (error) {
    console.log("getStudent", error);
    return null;
  }
};

export default getStudent;
