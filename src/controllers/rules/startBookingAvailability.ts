import ErrorHandler from "../../config/errorhandler";
import db from "../../database/setup";

const startBookingAvailability = () => {
  try {
    db.set("BookingAvailability.SuspendedIndefinitely", false);
    db.set("BookingAvailability.SuspendedUntilDate", false);
    db.save();
    return;
  } catch (error) {
    throw ErrorHandler(error, "startBookingAvailability");
  }
};

export default startBookingAvailability;
