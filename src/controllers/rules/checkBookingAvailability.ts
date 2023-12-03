import localDb from "../../config/localDb";
import getRules from "./getRules";

const checkBookingAvailability = async () => {
  const {
    BookingAvailability: {
      SuspendedIndefinitely,
      SuspendedUntilDate,
      BookingAvailabilityDate,
    },
  } = await getRules();

  if (SuspendedIndefinitely) return "الحجز متوقف لأجل غير مسمى";
  else if (SuspendedUntilDate) {
    if (new Date(BookingAvailabilityDate) > new Date()) {
      var dateString = BookingAvailabilityDate.toLocaleDateString(
        "ar-EG-u-nu-latn",
        { weekday: "long", year: "numeric", month: "short", day: "numeric" }
      );
      return `الحجز متوقف حتى ${dateString}`;
    } else {
      await new Promise((resolve, reject) => {
        try {
          const rulesData = localDb.push(
            "/rules/BookingAvailability/SuspendedUntilDate",
            false
          );
          resolve(rulesData);
        } catch (error: any) {
          console.log(error.message);
          reject(error);
        }
      });

      return true;
    }
  }
  return true;
};

export default checkBookingAvailability;
