export interface registeredData {
  accountId: string;
  chatId: string;
  recoveryId: string;
  fullName: string;
  name: string;
  type: "student" | "teacher" | "security" | "employee" | undefined;
  permissions: "user" | "admin" | "superAdmin";
}
