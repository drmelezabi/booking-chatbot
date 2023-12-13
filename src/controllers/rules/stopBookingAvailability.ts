import db from "../../database/setup";

const stopBookingAvailability = (BookingAvailabilityDate?: Date) => {
  try {
    if (!BookingAvailabilityDate) {
      db.set("BookingAvailability.SuspendedIndefinitely", true);
      db.set("BookingAvailability.SuspendedUntilDate", false);
      db.save();
      return;
    }

    db.set("BookingAvailability.SuspendedIndefinitely", false);
    db.set("BookingAvailability.SuspendedUntilDate", true);
    db.set(
      "BookingAvailability.BookingAvailabilityDate",
      BookingAvailabilityDate.toISOString()
    );

    db.save();
    return;
  } catch (error: any) {
    console.log(error.message);
  }
};

export default stopBookingAvailability;
