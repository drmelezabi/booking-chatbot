import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";

type type = "teacher" | "student" | "manager" | "security";

const deleteAccounts = async (
  type: type[] = ["teacher", "student", "manager", "security"]
): Promise<boolean> => {
  try {
    const q = query(
      collection(firestoreDb, "account"),
      where("type", "in", type)
    );

    const docSnap = await getDocs(q);

    const batch = writeBatch(firestoreDb);

    docSnap.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.commit();

    return true;
  } catch (error) {
    throw ErrorHandler(error, "deleteAccounts");
  }
};

export default deleteAccounts;
