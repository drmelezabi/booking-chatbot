import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import Sendmail from "./email";
import { levels } from "./enums";
import config from "./globalVariables";
import bugMessageTemplate from "../Email/bugsMailTemplate";

const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
} = config;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore();

// Initialize Firebase
const initializeFirebase = () => {
  try {
    firebaseApp;
    return firebaseApp;
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
};

export default initializeFirebase;
