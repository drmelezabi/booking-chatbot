//import dotenv module
import { config } from "dotenv";

//load
config();

//variables destructuring
const {
  NODE_ENV,
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  ACCOUNT_LISTS_SHEETS,
} = process.env;

if (
  !NODE_ENV ||
  !apiKey ||
  !authDomain ||
  !projectId ||
  !storageBucket ||
  !messagingSenderId ||
  !appId ||
  !measurementId ||
  !GOOGLE_SERVICE_ACCOUNT_EMAIL ||
  !GOOGLE_PRIVATE_KEY ||
  !ACCOUNT_LISTS_SHEETS
) {
  console.log("one or more environment variable are undefined");
}

//export variables with definitions
export default {
  // SERVER_PORT: SERVER_PORT as unknown as number,
  NODE_ENV: NODE_ENV || "development",
  apiKey: apiKey as string,
  authDomain: authDomain as string,
  projectId: projectId as string,
  storageBucket: storageBucket as string,
  messagingSenderId: messagingSenderId as string,
  appId: appId as string,
  measurementId: measurementId as string,
  googleServiceAccountEmail: GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
  googlePrivateKey: GOOGLE_PRIVATE_KEY as string,
  accountListsSheets: ACCOUNT_LISTS_SHEETS as string,
};
