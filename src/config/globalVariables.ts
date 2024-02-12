//import dotenv module
import { config } from "dotenv";

//load
config();

//variables destructuring
const {
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
  EMAIL_ADDRESS,
  SERVICE_APP_PASSWORD,
  ADMINISTRATION_EMAIL,
} = process.env;

if (
  !apiKey ||
  !authDomain ||
  !projectId ||
  !storageBucket ||
  !messagingSenderId ||
  !appId ||
  !measurementId ||
  !GOOGLE_SERVICE_ACCOUNT_EMAIL ||
  !GOOGLE_PRIVATE_KEY ||
  !ACCOUNT_LISTS_SHEETS ||
  !EMAIL_ADDRESS ||
  !SERVICE_APP_PASSWORD ||
  !ADMINISTRATION_EMAIL
) {
  throw new Error("one or more environment variable are undefined");
}

//export variables with definitions
export default {
  // SERVER_PORT: SERVER_PORT as unknown as number,
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
  googleServiceAccountEmail: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  googlePrivateKey: GOOGLE_PRIVATE_KEY,
  accountListsSheets: ACCOUNT_LISTS_SHEETS,
  emailService: EMAIL_ADDRESS,
  emailAppServicePass: SERVICE_APP_PASSWORD,
  administration_Email: ADMINISTRATION_EMAIL,
};
