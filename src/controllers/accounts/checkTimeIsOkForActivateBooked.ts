import getLocalReservations from "../rules/getLocalReservations";
import getRules from "../rules/getRules";

//تأكد ان الحجز لم يدخل نطاق التنفيذ أو قبله بساعتين

const checkTimeIsFitToCancelReservation = async (reservationId: string) => {
  const reservations = await getLocalReservations();

  if (
    reservations.filter((reservation) => {
      if (reservation.reservationId == reservationId) {
        const fiveMinutes = 5 * 60 * 1000; // Convert 5 minutes to milliseconds
        const fiftyNineMinutes = 59 * 60 * 1000; // Convert 59 minutes to milliseconds

        // Calculate the range
        const lowerBound = new Date(reservation.Date.getTime() - fiveMinutes);
        const upperBound = new Date(
          reservation.Date.getTime() + fiftyNineMinutes
        );

        // Check if dateA is within the range
        return new Date() >= lowerBound && new Date() <= upperBound;
      }
      return false;
    }).length
  )
    return true;
  else return false;
};

export default checkTimeIsFitToCancelReservation;
