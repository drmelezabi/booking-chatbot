import getLocalReservations from "../rules/getLocalReservations";

//تأكد ان الحجز لم يدخل نطاق التنفيذ أو قبله بساعتين

const checkTimeIsFitToActiveReservation = async (reservationId: string) => {
  const reservations = (await getLocalReservations()).filter(
    (reservation) => reservation.reservationId == reservationId
  );

  const validMinRange = reservations.filter((reservation) => {
    const fiveMinutes = 5 * 60 * 1000; // Convert 5 minutes to milliseconds

    const resDate = new Date(reservation.Date);

    // Calculate the range
    const lowerBound = new Date(resDate.getTime() - fiveMinutes + 7200000);

    // Check if dateA is within the range
    return new Date() >= lowerBound;
  }).length;

  if (!validMinRange) return 1;

  const validMaxRange = reservations.filter((reservation) => {
    const fiftyNineMinutes = 15 * 60 * 1000; // Convert 15 minutes to milliseconds

    const resDate = new Date(reservation.Date);

    // Calculate the range
    const upperBound = new Date(resDate.getTime() + fiftyNineMinutes + 7200000);

    // Check if dateA is within the range
    return new Date() <= upperBound;
  }).length;

  if (!validMaxRange) return 2;

  return 3;
};

export default checkTimeIsFitToActiveReservation;
