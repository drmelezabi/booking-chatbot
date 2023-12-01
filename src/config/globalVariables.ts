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
} = process.env;

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
};
