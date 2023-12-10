import localDb from "../../../config/localDb";

type blockedDates = { date: Date; reason: string; annually: boolean }[];

const getBlockedDates = async (): Promise<blockedDates> => {
  try {
    return localDb.getObject<blockedDates>("/rules/blockedDates");
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export default getBlockedDates;
