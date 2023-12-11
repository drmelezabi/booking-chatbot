import Reservation from "../../database/reservation";
import db from "../../database/setup";

//تأكد ان الحجز لم يدخل نطاق التنفيذ أو قبله بساعتين

const checkTimeIsFitToCancelReservation = async (reservationId: string) => {
  const reservations = Reservation.fetchAll();
  const maxTimeBeforeDelete = db.get<number>("maxTimeBeforeDelete");

  db.get<number>("maxTimeBeforeDelete");

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
