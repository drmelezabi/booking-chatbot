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

  function extractInformation(inputString: string): {
    room?: string;
    date?: string;
    time?: string;
  } {
    const roomRegex = /(?:قاعة|القاعة|القاعه|قاعه)\s+(\S+)/;
    const dateRegex = /(?:يوم|اليوم|تاريخ|التاريخ)\s+(\S+)/;
    const alternativeDateRegex =
      /(?:بكرة|بكره|بعد بكرة|بعد بكره|النهاردة|النهارده)\s+(\S+)/;
    const timeRegex =
      /(?:موعد|الموعد|التوقيت|توقيت|الساعة|ساعة|ساعه|الساعه)\s+(\S+)/;

    let dateMatch = dateRegex.exec(inputString);

    if (!dateMatch) {
      dateMatch = alternativeDateRegex.exec(inputString);
    }

    const roomMatch = roomRegex.exec(inputString);
    const timeMatch = timeRegex.exec(inputString);

    const result: { room?: string; date?: string; time?: string } = {};

    if (roomMatch) {
      result.room = roomMatch[1];
    }
    if (dateMatch) {
      result.date = dateMatch[1];
    }
    if (timeMatch) {
      result.time = timeMatch[1];
    }

    return result;
  }

  // Example usage:
  const input = "عاوز احجز ميعاد الساعة 1 في قاعة 107 بكرة";
  const extractedInfo = extractInformation(input);
  console.log(extractedInfo);
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
