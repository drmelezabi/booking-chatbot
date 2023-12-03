import getLocalReservations from "../rules/getLocalReservations";

const checkStudentHasNoUncompletedBooked = async (studentId: string) => {
  const reservations = await getLocalReservations();

  if (
    reservations.filter(
      (reservation) =>
        reservation.studentId == studentId &&
        new Date(reservations[0].Date) > new Date()
    ).length
  )
    return false;
  else return true;
};

export default checkStudentHasNoUncompletedBooked;
