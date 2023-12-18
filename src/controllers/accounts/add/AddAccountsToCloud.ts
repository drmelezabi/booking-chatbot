import { doc, writeBatch } from "firebase/firestore";

import { firestoreDb } from "../../../config/firebase";
import { genId20, recoveryCodeGen } from "../../../config/IDs";

import XLSX from "xlsx";
import fs from "fs";

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

type csvFileType = {
  permissions: "user" | "admin" | "superAdmin";
  fullName: string;
  RegistrationPin: string;
  type: "teacher" | "student" | "manager" | "security";
};

const createMultipleCloudAccounts = async (
  accounts: {
    shortName: string;
    fullName: string;
    gender: "male" | "female";
    permissions: "user" | "admin" | "superAdmin";
    type: "teacher" | "student" | "manager" | "security";
  }[]
) => {
  const batch = writeBatch(firestoreDb);

  const ForCsv: csvFileType[] = [];

  const pass = recoveryCodeGen();

  accounts.forEach((account) => {
    const newAccount: accountName = {
      permissions: account.permissions,
      fullName: account.fullName,
      name: account.shortName,
      gender: account.gender,
      pass,
      violations: [],
      whatsappId: "",
      type: account.type,
    };
    const docRef = doc(firestoreDb, "account", genId20());

    batch.set(docRef, newAccount);

    ForCsv.push({
      permissions: account.permissions,
      fullName: account.fullName,
      RegistrationPin: pass,
      type: account.type,
    });
  });

  try {
    await batch.commit();

    console.log({ ForCsv });
    const worksheet = XLSX.utils.json_to_sheet(ForCsv);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    fs.writeFileSync("./src/backup/output.xlsx", buffer);

    return true;
  } catch (error) {
    console.log(error);
    return true;
  }
};

export default createMultipleCloudAccounts;
