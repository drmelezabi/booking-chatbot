import db from "./setup";

type registeredPhone = {
  accountId: string; // studentId
  chatId: string;
  admin: boolean;
  type: "student" | "teacher" | "security" | "employee";
  recoveryId: string;
  name: string;
};

const RegisteredPhone = db.createCollection<registeredPhone>("registeredPhone");

export default RegisteredPhone;
