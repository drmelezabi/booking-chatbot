import ErrorHandler from "../../config/errorhandler";
import RegisteredPhone from "../../database/RegisteredPhone";

const isSuperAdmin = async (messageFrom: string) => {
  try {
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
  } catch (error) {
    throw ErrorHandler(error, "isSuperAdmin");
  }
};

export default isSuperAdmin;
