import db from "../../database/setup";

const startBookingAvailability = () => {
  try {
    db.set("BookingAvailability.SuspendedIndefinitely", false);
    db.set("BookingAvailability.SuspendedUntilDate", false);
    db.save();
    return;
  } catch (error: any) {
    console.log(error.message);
  }
};

export default startBookingAvailability;
