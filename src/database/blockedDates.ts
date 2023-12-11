import db from "./setup";

type blockedDates = {
  date: Date;
  reason: string;
  annually: boolean;
};

const BlockedDates = db.createCollection<blockedDates>("blockedDates");

export default BlockedDates;
