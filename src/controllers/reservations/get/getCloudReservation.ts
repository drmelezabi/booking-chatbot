import { getDoc, doc, Timestamp } from "firebase/firestore";
import { firestoreDb } from "../../../config/firebase";

type cloudReservation = {
  room: string;
  case: number;
  start: Timestamp;
  student: string;
  stdId: string;
  supervisor: string;
};

const getCloudReservationById = async (reservationId: string) => {
  try {
    const docRef = doc(firestoreDb, "reservation", reservationId);

    const docSnap = await getDoc(docRef);

    const document = docSnap.data();

    if (!document) return undefined;

    return document as cloudReservation;
  } catch (error) {
    console.log("getCloudReservationById", error);
    return undefined;
  }
};

export default getCloudReservationById;
