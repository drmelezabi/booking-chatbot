import localDb from "../../config/localDb";

const stopBookingAvailability = async (BookingAvailabilityDate?: Date) => {
  return new Promise((resolve, reject) => {
    try {
      if (!BookingAvailabilityDate) {
        const rulesData = localDb.push(
          "/rules/BookingAvailability",
          {
            SuspendedIndefinitely: true,
            SuspendedUntilDate: false,
          },
          false
        );
        resolve(rulesData);
        return;
      }
      const rulesData = localDb.push(
        "/rules/BookingAvailability",
        {
          SuspendedIndefinitely: false,
          SuspendedUntilDate: true,
          BookingAvailabilityDate: BookingAvailabilityDate,
        },
        true
      );
      resolve(rulesData);
      return;
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default stopBookingAvailability;
