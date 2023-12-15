import initializeFirebase from "./config/firebase";
import client from "./config/whatsapp";
import appSchedule from "./schedule";

(async () => {
  // await spreed();
  initializeFirebase();
  const cl = client.initialize();
  appSchedule();
  setTimeout(async () => {}, 25000);
})();
