import { firebaseApp } from "./config/firebase";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import router from "./resolvers";
import localDb, { chat } from "./config/localDb";
import db from "./database/setup";
import appSchedule from "./controllers/schedual";

(async () => {
  appSchedule();

  const initializeFirebaseApp = () => {
    try {
      firebaseApp;
      return firebaseApp;
    } catch (error) {
      console.log("initializeFirebaseApp", error);
    }
  };
  initializeFirebaseApp();
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
  await localDb.reload();
  await chat.reload();
  db.save();

  await router(client, message);
});

client.initialize();
