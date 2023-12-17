import { ContactId } from "whatsapp-web.js";

export interface registeredData {
  accountId: string; // studentId
  chatId: string;
  permissions: "user" | "admin" | "superAdmin";
  fullName: string;
  type: "student" | "teacher" | "security" | "manager";
  recoveryId: string;
  name: string;
  contact: ContactId;
  gender: "male" | "female";
}
