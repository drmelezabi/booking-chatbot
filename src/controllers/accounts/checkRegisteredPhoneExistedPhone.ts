import localDb from "../../config/localDb";
import { registeredData } from "./createRegisteredPhone";

const checkRegisteredPhoneExistedPhone = async (chatId: string) => {
  const reg = (
    await localDb.getObject<registeredData[]>("/registeredPhone")
  ).filter((reg) => reg.chatId === chatId);
  if (!reg.length) return false;
  else return true;
};

export default checkRegisteredPhoneExistedPhone;
