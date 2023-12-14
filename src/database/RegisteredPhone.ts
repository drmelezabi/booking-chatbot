import db from "./setup";

type registeredPhone = {
  accountId: string; // studentId
  chatId: string;
  permissions: "user" | "admin" | "superAdmin";
  fullName: string;
  type: "student" | "teacher" | "security" | "employee" | undefined;
  recoveryId: string;
  name: string;
};

const RegisteredPhone = db.createCollection<registeredPhone>("registeredPhone");

export default RegisteredPhone;
