import checkRegisteredPhones from "../rules/getRegisteredPhones";

const isAdmin = async (messageFrom: string) => {
  const registeredPhones = await checkRegisteredPhones();

  const IsExist = registeredPhones.filter(
    (account) => account.chatId === messageFrom
  );

  if (!IsExist.length) return "انت تستخدم هاتف خارج المنظومه" as string;
  else {
    const IsAdmin = IsExist.filter((account) => account.admin === true);
    if (!IsAdmin.length) return "❌ لا تملك صلاحية تنفيذ الأمر" as string;
    else {
      return true;
    }
  }
};

export default isAdmin;
