import { registeredData } from "../accounts/createRegisteredPhone";
import localDb from "../../config/localDb";

const checkRegisteredPhones = async (): Promise<registeredData[]> => {
  try {
    return await localDb.getObject<registeredData[]>("/registeredPhone");
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export default checkRegisteredPhones;
