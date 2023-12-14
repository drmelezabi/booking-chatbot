// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import config from "./globalVariables";
import {
  doc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
  query,
  DocumentData,
} from "firebase/firestore";

const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
} = config;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const addDocument = async (
  collectionName: string,
  documentId: string,
  data: object
) => {
  try {
    const document = doc(firestoreDb, collectionName, documentId);
    await setDoc(document, data);
    return true;
  } catch (error) {
    console.log("add", error);
    return false;
  }
};
