import schedule from "node-schedule";

import backup from "../backup/backup";
import Sendmail from "../config/email";
import { levels } from "../config/enums";
import client from "../config/whatsapp";
import getAvailViolations from "../controllers/accounts/get/getAvailViolations";
import getStudentViolationsForScheduleAndGroup from "../controllers/accounts/get/getStudentViolationsForScheduleAndGroup";
import RegisteredPhone from "../database/RegisteredPhone";
import Reservation from "../database/reservation";
import bugMessageTemplate from "../Email/bugsMailTemplate";

export default function appSchedule() {
  const tz = "Africa/Cairo";
  const startHour = 6;
  const endHour = 19;

  const rule_waste = new schedule.RecurrenceRule();
  rule_waste.minute = [16, 46];
  rule_waste.tz = tz;

  try {
    for (let hour = startHour; hour <= endHour; hour++) {
      rule_waste.hour = hour;
      schedule.scheduleJob(rule_waste, async () => {
        await getAvailViolations();
        await getStudentViolationsForScheduleAndGroup();
      });
    }
  } catch (error: unknown) {
    let emailContent = `rule_waste schedule App Error`;
    if (error instanceof Error) {
      emailContent = `rule_waste schedule App Error\n\n ${error.message}`;
    } else {
      emailContent = `rule_waste schedule App Error\n\n ${error}`;
    }
    const messageTemplate = bugMessageTemplate(levels.error, emailContent);
    Sendmail(undefined, "Booking Bot may not working now", messageTemplate);
    return;
  }

  // =================================================================

  const rule_checkResStart = new schedule.RecurrenceRule();
  rule_checkResStart.minute = [2, 32];
  rule_checkResStart.tz = tz;

  try {
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
            );

            if (!student) throw new Error("student should not be nullable");

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
  } catch (error: unknown) {
    let emailContent = `rule_checkResStart schedule Error`;
    if (error instanceof Error) {
      emailContent = `rule_checkResStart schedule Error\n\n ${error.message}`;
    } else {
      emailContent = `rule_checkResStart schedule Error\n\n ${error}`;
    }
    const messageTemplate = bugMessageTemplate(levels.error, emailContent);
    Sendmail(undefined, "Booking Bot may not working now", messageTemplate);
    return;
  }

  // =================================================================

  try {
    const rule_backup = new schedule.RecurrenceRule();
    rule_backup.dayOfWeek = 4; // Thursday
    rule_backup.hour = 16; // 4 PM
    rule_backup.minute = 45; // 45 minutes past the hour
    rule_backup.tz = tz;

    schedule.scheduleJob(rule_backup, async () => {
      await backup("Email");
    });
  } catch (error: unknown) {
    let emailContent = `rule_backup Error`;
    if (error instanceof Error) {
      emailContent = `rule_backup Error\n\n ${error.message}`;
    } else {
      emailContent = `rule_backup Error\n\n ${error}`;
    }
    const messageTemplate = bugMessageTemplate(levels.error, emailContent);
    Sendmail(undefined, "Booking Bot may not working now", messageTemplate);
    return;
  }
}
