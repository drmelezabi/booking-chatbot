import ErrorHandler from "../../config/errorhandler";
import RegisteredPhone from "../../database/RegisteredPhone";

const isAdmin = async (messageFrom: string) => {
  try {
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
  } catch (error) {
    throw ErrorHandler(error, "isAdmin");
  }
};

export default isAdmin;
