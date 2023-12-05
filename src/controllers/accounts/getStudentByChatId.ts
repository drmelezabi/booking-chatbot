import localDb from "../../config/localDb";
import { registeredData } from "./createRegisteredPhone";

const getAccountByChatId = async (
  chatId: string
): Promise<registeredData | null> => {
  try {
    const std = (
      await localDb.getObject<registeredData[]>("/registeredPhone")
    ).filter((reg) => reg.chatId === chatId);
    if (!std.length) return null;
    return std[0];
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export default getAccountByChatId;
