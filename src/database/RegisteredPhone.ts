import { ContactId } from "whatsapp-web.js";

import db from "./setup";

export type IRegisteredPhone = {
  accountId: string; // studentId
  chatId: string;
  permissions: "user" | "admin" | "superAdmin";
  fullName: string;
  type: "student" | "teacher" | "security" | "manager";
  recoveryId: string;
  name: string;
  contact: ContactId;
  gender: "male" | "female";
};

const RegisteredPhone =
  db.createCollection<IRegisteredPhone>("registeredPhone");

export default RegisteredPhone;
