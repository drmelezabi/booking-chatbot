import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import config from "./globalVariables";

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
  } catch (error) {
    console.log("initializeFirebase", error);
  }
};

export default initializeFirebase;
