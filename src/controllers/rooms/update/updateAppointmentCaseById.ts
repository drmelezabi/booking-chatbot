import { doc, updateDoc } from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";

// Assuming you've initialized Firestore with `firestoreDb`

export async function updateReservationCaseById(
  reservationId: string,
  reservationCase: number
) {
  try {
    const reservationRef = doc(firestoreDb, "reservation", reservationId);

    await updateDoc(reservationRef, { case: reservationCase });
    return true;
  } catch (error) {
    throw ErrorHandler(error, "updateReservationCaseById");
  }
}
