import { JSONData } from "simpl.db";

import db from "./setup";
type rules = {
  BookingAvailability: {
    SuspendedIndefinitely: boolean;
    SuspendedUntilDate: boolean;
    BookingAvailabilityDate: Date;
  };
  maxTimeToBookAfterItsStartInMin: number;
  bookingOpen: number;
  bookingClose: number;
  blockedDays: ("Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat")[];
  punishmentUnit: number;
  maxTimeBeforeDelete: number;
  rooms: string[];
};

const set = (b: rules) => {
  const jsonString = JSON.stringify(b) as JSONData;
  db.set("rules", jsonString);
  db.save();
};

const update = (b: Partial<rules>) => {
  const jsonString = JSON.stringify(b) as JSONData;
  db.set("BookingAvailability", jsonString);
  db.save();
};

const get = () => db.get("BookingAvailability") as unknown as rules;

const bookingAvailability = {
  set,
  update,
  get,
};

export default bookingAvailability;
