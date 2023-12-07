import localDb from "../../config/localDb";

const startBookingAvailability = async () => {
  try {
    await localDb.push(
      "/rules/BookingAvailability",
      {
        SuspendedIndefinitely: false,
        SuspendedUntilDate: false,
      },
      false
    );
    // Save the data (useful if you disable the saveOnPush)
    await localDb.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await localDb.reload();
    return;
  } catch (error: any) {
    console.log(error.message);
  }
};

export default startBookingAvailability;
