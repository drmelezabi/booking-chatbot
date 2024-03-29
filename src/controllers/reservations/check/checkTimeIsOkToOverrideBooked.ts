import ErrorHandler from "../../../config/errorhandler";
import Reservation from "../../../database/reservation";

//تأكد ان الحجز لم يدخل نطاق التنفيذ أو قبله بساعتين

const checkTimeIsOkToOverrideBooked = async (reservationId: string) => {
  try {
    const reservations = Reservation.fetchAll();

    if (
      reservations.filter((reservation) => {
        if (reservation.reservationId == reservationId) {
          const tenMinutes = 10 * 60 * 1000; // Convert 5 minutes to milliseconds

          // Calculate the range
          const upperBound = new Date(reservation.Date.getTime() + tenMinutes);

          // Check if dateA is within the range
          return new Date() > upperBound;
        }
        return false;
      }).length
    )
      return true;
    else return false;
  } catch (error) {
    throw ErrorHandler(error, "checkTimeIsOkToOverrideBooked");
  }
};

export default checkTimeIsOkToOverrideBooked;
