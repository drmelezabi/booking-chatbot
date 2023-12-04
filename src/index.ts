import { firebaseApp } from "./config/firebase";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import router from "./resolvers";
import { getDayRange } from "./controllers/date/getDayRange";

(async () => {
  const initializeFirebaseApp = () => {
    try {
      firebaseApp;
      return firebaseApp;
    } catch (error) {
      console.log("initializeFirebaseApp", error);
    }
  };
  initializeFirebaseApp();

  console.log(getDayRange("Wed"));

  // console.log(await getRecovery(`+رمز استعاده 201020205256`));
})();

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");
});

// Save session values to the file upon successful auth
client.on("authenticated", () => {
  console.log("authenticated succeed");
});

client.on("message", async (message) => {
  await router(client, message);
});

client.initialize();
