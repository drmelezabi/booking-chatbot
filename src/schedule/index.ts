import schedule from "node-schedule";
import Reservation from "../database/reservation";
import getStudentViolations from "../controllers/accounts/get/getStudentViolations";

export default function appSchedule() {
  // const tz = "Africa/Cairo";
  // const startHour = 6;
  // const endHour = 19;
  // const rule_wasted = new schedule.RecurrenceRule();
  // rule_wasted.minute = [16, 46];
  // rule_wasted.tz = tz;
  // const rule_start = new schedule.RecurrenceRule();
  // rule_start.minute = [16, 46];
  // rule_start.tz = tz;
  // for (let hour = startHour; hour <= endHour; hour++) {
  //   rule_wasted.hour = hour;
  //   schedule.scheduleJob(rule_wasted, () => {
  //     const violateReservations = Reservation.fetchMany((reservation) => {
  //       const deadline = new Date(reservation.Date);
  //       deadline.setTime(deadline.getTime() + 15 * 60 * 1000);
  //       return deadline < new Date();
  //     });
  //     Promise.all(
  //       violateReservations.map(async (reservation) => {
  //         await getStudentViolations(reservation.accountId);
  //       })
  //     );
  //   });
  //   rule_start.hour = hour;
  //   schedule.scheduleJob(rule_start, () => {
  //     const violateReservations = Reservation.fetchMany((reservation) => {
  //       const deadline = new Date(reservation.Date);
  //       deadline.setTime(deadline.getTime() + 15 * 60 * 1000);
  //       return deadline < new Date();
  //     });
  //     Promise.all(
  //       violateReservations.map(async (reservation) => {
  //         await getStudentViolations(reservation.accountId);
  //       })
  //     );
  //   });
  // }
}
