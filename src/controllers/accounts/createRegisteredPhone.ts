import localDb from "../../config/localDb";

export interface registeredData {
  accountId: string;
  chatId: string;
  recoveryId: string;
  name: string;
  type: "student" | "teacher" | "security" | "employee" | undefined;
  admin: boolean;
}

const createRegisteredPhone = async (data: registeredData) => {
  try {
    localDb.push("/registeredPhone[]", data, true);
    // Save the data (useful if you disable the saveOnPush)
    await localDb.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await localDb.reload();
    return;
  } catch (error: any) {
    console.log(error.message);
    return;
  }
};

export default createRegisteredPhone;
