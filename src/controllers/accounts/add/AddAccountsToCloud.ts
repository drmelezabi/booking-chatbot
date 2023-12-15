import { Timestamp } from "firebase/firestore";
import { firestoreDb } from "../../../config/firebase";
import { writeBatch, doc } from "firebase/firestore";
import { genId20, recoveryCodeGen } from "../../../config/IDs";

type accountName = {
  permissions: "user" | "admin" | "superAdmin";
  name: string;
  fullName: string;
  pass: string;
  violations: string[];
  whatsappId: string;
  type: "teacher" | "student" | "manager" | "security";
};

const createMultipleCloudAccounts = async (
  accounts: {
    [key: string]: any;
  }[],
  type: "teacher" | "student" | "manager" | "security"
) => {
  const batch = writeBatch(firestoreDb);

  accounts.forEach((account) => {
    const newAccount: accountName = {
      permissions: "user",
      fullName: account.fullName,
      name: account.shortName,
      pass: recoveryCodeGen(),
      violations: [],
      whatsappId: "",
      type,
    };
    const docRef = doc(firestoreDb, "account", genId20());

    batch.set(docRef, newAccount);
  });

  try {
    await batch.commit();
    return true;
  } catch (error) {
    console.log(error);
    return true;
  }
};

export default createMultipleCloudAccounts;
