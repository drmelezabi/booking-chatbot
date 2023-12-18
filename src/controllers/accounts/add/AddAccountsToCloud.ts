import { doc, writeBatch } from "firebase/firestore";

import { firestoreDb } from "../../../config/firebase";
import { genId20, recoveryCodeGen } from "../../../config/IDs";

type accountName = {
  permissions: "user" | "admin" | "superAdmin";
  name: string;
  fullName: string;
  pass: string;
  violations: string[];
  whatsappId: string;
  type: "teacher" | "student" | "manager" | "security";
  gender: "male" | "female";
};

const createMultipleCloudAccounts = async (
  accounts: {
    shortName: string;
    fullName: string;
    gender: "male" | "female";
    permissions: "user" | "admin" | "superAdmin";
  }[],
  type: "teacher" | "student" | "manager" | "security"
) => {
  const batch = writeBatch(firestoreDb);

  accounts.forEach((account) => {
    const newAccount: accountName = {
      permissions: account.permissions,
      fullName: account.fullName,
      name: account.shortName,
      gender: account.gender,
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
