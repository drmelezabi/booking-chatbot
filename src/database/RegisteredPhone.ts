import db from "./setup";

type registeredPhone = {
  accountId: string; // studentId
  chatId: string;
  admin: boolean;
  type: "student" | "teacher" | "security" | "employee" | undefined;
  recoveryId: string;
  name: string;
};

const RegisteredPhone = db.createCollection<registeredPhone>("registeredPhone");

export default RegisteredPhone;
