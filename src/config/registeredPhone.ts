import { JsonDB, Config } from "node-json-db";

interface IRegisteredPhone {
  studentId: string;
  phoneId: string;
}
export const registeredPhone = async (): Promise<IRegisteredPhone[]> => {
  try {
    const localDb = new JsonDB(
      new Config("src/config/localDb", true, false, "/")
    );

    return await localDb.getObject<IRegisteredPhone[]>("/registeredPhone");
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};
