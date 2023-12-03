import localDb from "../../config/localDb";

const startBookingAvailability = async () => {
  return new Promise((resolve, reject) => {
    try {
      const rulesData = localDb.push(
        "/rules/BookingAvailability",
        {
          SuspendedIndefinitely: false,
          SuspendedUntilDate: false,
        },
        false
      );
      resolve(rulesData);
      return;
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default startBookingAvailability;
