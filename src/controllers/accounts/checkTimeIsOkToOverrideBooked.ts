import Reservation from "../../database/reservation";
import getLocalReservations from "../rules/getLocalReservations";
import getRules from "../rules/getRules";

//تأكد ان الحجز لم يدخل نطاق التنفيذ أو قبله بساعتين

const checkTimeIsOkToOverrideBooked = async (reservationId: string) => {
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
};

export default checkTimeIsOkToOverrideBooked;
