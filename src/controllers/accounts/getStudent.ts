import { doc, getDoc } from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

export interface studentData {
  admin: boolean;
  name: string;
  pass: string;
  type: string;
  whatsappId: string;
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
