import schedule from "node-schedule";

import backup from "../backup/backup";
import client from "../config/whatsapp";
import getAvailViolations from "../controllers/accounts/get/getAvailViolations";
import getStudentViolationsForScheduleAndGroup from "../controllers/accounts/get/getStudentViolationsForScheduleAndGroup";
import RegisteredPhone from "../database/RegisteredPhone";
import Reservation from "../database/reservation";

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
    schedule.scheduleJob(rule_waste, async () => {
      await getAvailViolations();
      await getStudentViolationsForScheduleAndGroup();
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

  const rule_backup = new schedule.RecurrenceRule();
  rule_backup.dayOfWeek = 4; // Thursday
  rule_backup.hour = 16; // 4 PM
  rule_backup.minute = 45; // 45 minutes past the hour
  rule_backup.tz = tz;

  schedule.scheduleJob(rule_backup, async () => {
    await backup("Email");
  });
}
