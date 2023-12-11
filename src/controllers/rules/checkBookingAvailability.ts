import db from "../../database/setup";

const checkBookingAvailability = async () => {
  const SuspendedIndefinitely = db.get<boolean>("SuspendedIndefinitely");
  const SuspendedUntilDate = db.get<boolean>("SuspendedUntilDate");
  const BookingAvailabilityDate = new Date(
    db.get<string>("BookingAvailabilityDate")
  );

  if (SuspendedIndefinitely) return "الحجز متوقف لأجل غير مسمى";
  else if (SuspendedUntilDate) {
    if (new Date(BookingAvailabilityDate) > new Date()) {
      var dateString = BookingAvailabilityDate.toLocaleDateString(
        "ar-EG-u-nu-latn",
        { weekday: "long", year: "numeric", month: "short", day: "numeric" }
      );
      return `الحجز متوقف حتى ${dateString}`;
    } else {
      try {
        db.set("BookingAvailability.SuspendedUntilDate", false);
        db.save();
        // await localDb.push(
        //   "/rules/BookingAvailability/SuspendedUntilDate",
        //   false
        // );
        // Save the data (useful if you disable the saveOnPush)
        // await localDb.save();

        // In case you have an exterior change to the databse file and want to reload it
        // use this method
        // await localDb.reload();
      } catch (error: any) {
        console.log(error.message);
      }

      return true;
    }
  }
  return true;
};

export default checkBookingAvailability;
