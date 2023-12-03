import { JsonDB, Config } from "node-json-db";

interface IRegisteredPhone {
  studentId: string;
  phoneId: string;
}
export const registeredPhone = async (): Promise<IRegisteredPhone[]> => {
  return new Promise((resolve, reject) => {
    try {
      const localDb = new JsonDB(
        new Config("src/config/localDb", true, false, "/")
      );

      const rulesData =
        localDb.getObject<IRegisteredPhone[]>("/registeredPhone");
      resolve(rulesData);
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};
