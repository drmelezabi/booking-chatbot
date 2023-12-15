import schedule from "node-schedule";
import Reservation from "../database/reservation";
import getStudentViolations from "../controllers/accounts/get/getStudentViolations";
import RegisteredPhone from "../database/RegisteredPhone";
import client from "../config/whatsapp";

export default function appSchedule() {
  const tz = "Africa/Cairo";
  const startHour = 6;
  const endHour = 19;

  const rule_waste = new schedule.RecurrenceRule();
  rule_waste.minute = [16, 46];
  rule_waste.tz = tz;

  const rule_checkResStart = new schedule.RecurrenceRule();
  rule_checkResStart.minute = [2, 32];
  rule_checkResStart.tz = tz;

  for (let hour = startHour; hour <= endHour; hour++) {
    rule_waste.hour = hour;
    schedule.scheduleJob(rule_waste, () => {
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

  for (let hour = startHour; hour <= endHour; hour++) {
    rule_checkResStart.hour = hour;
    schedule.scheduleJob(rule_checkResStart, () => {
      const violateReservations = Reservation.fetchMany((reservation) => {
        const deadline = new Date(reservation.Date);
        deadline.setTime(deadline.getTime() + 2 * 60 * 1000);
        return deadline < new Date();
      });
      const studentsIds = violateReservations.map((res) => res.accountId);
      const students = RegisteredPhone.fetchMany((std) =>
        studentsIds.includes(std.accountId)
      );

      Promise.all(
        violateReservations.map(async (reservation) => {
          const student = students.find(
            (std) => std.accountId === reservation.accountId
          )!;
          client.sendMessage(
            student.chatId,
            `${student.name} اين ${
              student.gender === "male" ? "أنت" : "أنتِ"
            } !!\n\nالحجز الخاص بك آن وقته ولم يتم تفعيله مع أحد المشرفين حتى الآن`
          );
        })
      );
    });
  }
}
