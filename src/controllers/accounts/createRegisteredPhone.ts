import localDb from "../../config/localDb";

export interface registeredData {
  studentId: string;
  chatId: string;
  recoveryId: string;
  name: string;
  type: string;
  admin: boolean;
}

const createRegisteredPhone = async (data: registeredData) => {
  try {
    localDb.push("/registeredPhone[]", data, true);
    return;
  } catch (error: any) {
    console.log(error.message);
    return;
  }
};

export default createRegisteredPhone;
