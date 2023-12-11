import Reservation from "../../database/reservation";

const checkStudentHasNoUncompletedBooked = async (studentId: string) => {
  const reservations = Reservation.fetchAll();

  if (
    reservations.filter(
      (reservation) =>
        reservation.accountId == studentId &&
        new Date(reservations[0].Date) > new Date()
    ).length
  )
    return false;
  else return true;
};

export default checkStudentHasNoUncompletedBooked;
