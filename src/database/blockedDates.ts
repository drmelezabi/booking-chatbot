import db from "./setup";

export type IBlockedDates = {
  date: Date;
  reason: string;
  annually: boolean;
};

const BlockedDates = db.createCollection<IBlockedDates>("blockedDates");

export default BlockedDates;
