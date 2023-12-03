import getLocalReservations from "../rules/getLocalReservations";
import getRules from "../rules/getRules";

//تأكد ان الحجز لم يدخل نطاق التنفيذ أو قبله بساعتين

const checkTimeIsFitToCancelReservation = async (reservationId: string) => {
  const reservations = await getLocalReservations();
  const { maxTimeBeforeDelete } = await getRules();

  if (
    reservations.filter((reservation) => {
      const newDate = new Date(reservation.Date);
      newDate.setHours(newDate.getHours() - maxTimeBeforeDelete);

      return reservation.reservationId == reservationId && newDate > new Date();
    }).length
  )
    return true;
  else return false;
};

export default checkTimeIsFitToCancelReservation;
