import { registeredData } from "./../accounts/createRegisteredPhone";
import localDb from "../../config/localDb";

const checkRegisteredPhoneByRecoveryId = async (
  recoveryId: string
): Promise<registeredData | null> => {
  try {
    return (
      (await localDb.getObject<registeredData[]>("/registeredPhone")).filter(
        (reg) => reg.recoveryId === recoveryId
      )[0] || null
    );
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export default checkRegisteredPhoneByRecoveryId;
