import localDb from "../../../config/localDb";

type blockedDays = ("Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat")[];

const getBlockedDays = async (): Promise<blockedDays> => {
  try {
    return localDb.getObject<blockedDays>("/rules/blockedDays");
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export default getBlockedDays;
