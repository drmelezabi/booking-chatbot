import initializeFirebase from "./config/firebase";
import client from "./config/whatsapp";
import appSchedule from "./schedule";

(async () => {
  initializeFirebase();
  client.initialize();
  appSchedule();
})();
