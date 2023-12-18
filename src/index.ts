import Sendmail from "./config/email";
import { levels } from "./config/enums";
import initializeFirebase from "./config/firebase";
import client from "./config/whatsapp";
import bugMessageTemplate from "./Email/bugsMailTemplate";
import appSchedule from "./schedule";

(async () => {
  try {
    initializeFirebase();
    client.initialize();
    appSchedule();
  } catch (error: unknown) {
    let emailContent = `initialize App Error`;
    if (error instanceof Error) {
      emailContent = `initialize App Error\n\n ${error.message}`;
    } else {
      emailContent = `initialize App Error\n\n ${error}`;
    }
    const messageTemplate = bugMessageTemplate(levels.error, emailContent);
    Sendmail(undefined, "Booking Bot may not working now", messageTemplate);
    return;
  }
})();
