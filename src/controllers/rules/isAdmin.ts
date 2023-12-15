import RegisteredPhone from "../../database/RegisteredPhone";

const isAdmin = async (messageFrom: string) => {
  const existedRegisteredPhones = RegisteredPhone.fetch(
    (account) => account.chatId === messageFrom
  );

  if (!existedRegisteredPhones)
    return "انت تستخدم هاتف خارج المنظومه" as string;

  const IsAdmin = ["admin", "superAdmin"].includes(
    existedRegisteredPhones.permissions
  );

  if (!IsAdmin) return "❌ لا تملك صلاحية تنفيذ الأمر" as string;

  return true;
};

export default isAdmin;
