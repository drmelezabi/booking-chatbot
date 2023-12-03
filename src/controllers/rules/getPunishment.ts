import localDb from "../../config/localDb";

const getPunishmentUnit = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const rulesData = localDb.getObject<number>("/punishmentUnit");
      resolve(rulesData);
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default getPunishmentUnit;
