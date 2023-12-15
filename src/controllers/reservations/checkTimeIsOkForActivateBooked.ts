import Reservation from "../../database/reservation";

//تأكد ان الحجز لم يدخل نطاق التنفيذ أو قبله بساعتين

const checkTimeIsFitToActiveReservation = async (reservationId: string) => {
  const reservation = Reservation.fetch(
    (reservation) => reservation.reservationId === reservationId
  );

  if (!reservation) return 0;

  const fiveMinutes = 5 * 60 * 1000; // Convert 5 minutes to milliseconds
  const fiftyNineMinutes = 15 * 60 * 1000; // Convert 15 minutes to milliseconds

  const resDate = new Date(reservation.Date);

  // Calculate the range
  const lowerBound = new Date(resDate.getTime() - fiveMinutes + 7200000);
  // Calculate the range
  const upperBound = new Date(resDate.getTime() + fiftyNineMinutes + 7200000);

  // Check if dateA is within the range
  if (!(new Date() >= lowerBound)) return 1;
  // Check if dateA is within the range
  if (!(new Date() <= upperBound)) return 2;

  return 3;
};

export default checkTimeIsFitToActiveReservation;
