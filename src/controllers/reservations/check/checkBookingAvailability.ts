import db from "../../../database/setup";

const checkBookingAvailability = async () => {
  const SuspendedIndefinitely = db.get<boolean>("SuspendedIndefinitely");
  const SuspendedUntilDate = db.get<boolean>("SuspendedUntilDate");
  const BookingAvailabilityDate = new Date(
    db.get<string>("BookingAvailabilityDate")
  );

  if (SuspendedIndefinitely) return "الحجز متوقف لأجل غير مسمى";
  else if (SuspendedUntilDate) {
    if (new Date(BookingAvailabilityDate) > new Date()) {
      const dateString = BookingAvailabilityDate.toLocaleDateString(
        "ar-EG-u-nu-latn",
        { weekday: "long", year: "numeric", month: "short", day: "numeric" }
      );
      return `الحجز متوقف حتى ${dateString}`;
    } else {
      try {
        db.set("BookingAvailability.SuspendedUntilDate", false);
        db.save();
      } catch (error: any) {
        console.log(error.message);
      }

      return true;
    }
  }
  return true;
};

export default checkBookingAvailability;
