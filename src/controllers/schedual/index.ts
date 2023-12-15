import schedule from "node-schedule";
import Reservation from "../../database/reservation";
import getStudentViolations from "../accounts/get/getStudentViolations";

export default function appSchedule() {
  const tz = "Africa/Cairo";
  const startHour = 6;
  const endHour = 19;

  const rule = new schedule.RecurrenceRule();
  rule.minute = [16, 46];
  rule.tz = tz;

  for (let hour = startHour; hour <= endHour; hour++) {
    rule.hour = hour;
    schedule.scheduleJob(rule, () => {
      const violateReservations = Reservation.fetchMany((reservation) => {
        const deadline = new Date(reservation.Date);
        deadline.setTime(deadline.getTime() + 15 * 60 * 1000);
        return deadline < new Date();
      });

      Promise.all(
        violateReservations.map(async (reservation) => {
          await getStudentViolations(reservation.accountId);
        })
      );
    });
  }
}
