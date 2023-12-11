import { JsonDB, Config } from "node-json-db";

const localDb = new JsonDB(new Config("src/config/localDb", true, false, "/"));
export const chatCash = new JsonDB(
  new Config("src/config/chatCash", true, false, "/")
);

export const expected = new JsonDB(
  new Config("src/config/expected", true, false, "/")
);

export const chat = new JsonDB(
  new Config("collections/chat", true, false, "/")
);
export const menu = new JsonDB(new Config("src/config/menu", true, false, "/"));

export default localDb;

interface IChatData {
  lastMessage: Date;
  taskSyntax: string;
  counter: number;
  data: { [key: string]: unknown };
}

interface accountId {
  [key: string]: IChatData;
}

interface database {
  rules: {
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
    blockedDates: {
      date: Date;
      reason: string;
      annually: boolean;
    }[];
    maxTimeBeforeDelete: number;
    rooms: string[];
  };
  registeredPhone: {
    studentId: string;
    chatId: string;
    admin: boolean;
    type: "student" | "teacher" | "security" | "employee";
    recoveryId: string;
    name: string;
  }[];
  activationPin: {
    reservationId: string;
    pin: number;
    creationDate: Date;
    name: string;
  }[];
  avail: {
    hostId: string;
    pin: number;
    reservationId: string;
    host: boolean;
    availId?: string;
    reservationDate: Date;
    availCreatedDate: Date;
    availName?: string;
  }[];
  suspendedStudent: {
    studentId: string;
    ViolationCounter: number;
    suspensionCase: Boolean;
    BookingAvailabilityDate: Date;
    violations: string[];
  }[];
  reservation: {
    studentId: string;
    reservationId: string;
    Date: Date;
  }[];
}
