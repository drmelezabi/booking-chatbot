import { ContactId } from "whatsapp-web.js";
import db from "./setup";

type registeredPhone = {
  accountId: string; // studentId
  chatId: string;
  permissions: "user" | "admin" | "superAdmin";
  fullName: string;
  type: "student" | "teacher" | "security" | "employee" | undefined;
  recoveryId: string;
  name: string;
  contact: ContactId;
  gender: "male" | "female";
};

const RegisteredPhone = db.createCollection<registeredPhone>("registeredPhone");

export default RegisteredPhone;
