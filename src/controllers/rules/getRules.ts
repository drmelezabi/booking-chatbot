import localDb from "../../config/localDb";

interface BookingAvailability {
  SuspendedIndefinitely: Boolean;
  SuspendedUntilDate: Boolean;
  BookingAvailabilityDate: Date;
}

interface IRules {
  BookingAvailability: BookingAvailability;
  blockedDays: ("Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat")[];
  blockedDates: { date: Date; reason: string; annually: boolean }[];
  bookingOpen: number;
  bookingClose: number;
  maxTimeBeforeDelete: number;
  maxTimeToBookAfterItsStartInMin: number;
  rooms: string[];
}

const getRules = async (): Promise<IRules> => {
  return new Promise((resolve, reject) => {
    try {
      const rulesData = localDb.getObject<IRules>("/rules");
      resolve(rulesData);
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default getRules;
