import RegisteredPhone from "../../database/RegisteredPhone";

const isSuperAdmin = async (messageFrom: string) => {
  const existedRegisteredPhones = RegisteredPhone.fetch(
    (account) => account.chatId === messageFrom
  );

  if (!existedRegisteredPhones)
    return "انت تستخدم هاتف خارج المنظومه" as string;

  const IsSuperAdmin = ["superAdmin"].includes(
    existedRegisteredPhones.permissions
  );

  if (!IsSuperAdmin) return "❌ لا تملك صلاحية تنفيذ الأمر" as string;

  return true;
};

export default isSuperAdmin;
