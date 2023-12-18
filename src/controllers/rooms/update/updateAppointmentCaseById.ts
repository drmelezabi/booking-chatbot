import { doc, updateDoc } from "firebase/firestore";

import { firestoreDb } from "../../../config/firebase";

// Assuming you've initialized Firestore with `firestoreDb`

export async function updateReservationCaseById(
  reservationId: string,
  reservationCase: number
) {
  const reservationRef = doc(firestoreDb, "reservation", reservationId);

  try {
    await updateDoc(reservationRef, { case: reservationCase });
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}
