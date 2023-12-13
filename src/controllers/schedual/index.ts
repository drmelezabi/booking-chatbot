import schedule from "node-schedule";
import Reservation from "../../database/reservation";

const tz = "Africa/Cairo";
const startHour = 6;
const endHour = 19;

const rule = new schedule.RecurrenceRule();
rule.minute = [16, 46];
rule.tz = tz;

for (let hour = startHour; hour <= endHour; hour++) {
  rule.hour = hour;
  schedule.scheduleJob(rule, () => {
    Reservation.fetchMany((reservation) => {
      const deadline = new Date(reservation.Date);
      deadline.setTime(deadline.getTime() + 15 * 60 * 1000);
      return deadline < new Date();
    });
  });
}

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
      Reservation.fetchMany((reservation) => {
        const deadline = new Date(reservation.Date);
        deadline.setTime(deadline.getTime() + 15 * 60 * 1000);
        return deadline < new Date();
      });
    });
  }
}
