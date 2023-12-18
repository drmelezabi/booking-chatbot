import { doc, updateDoc } from "firebase/firestore";

import { firestoreDb } from "../../../config/firebase";

// Assuming you've initialized Firestore with `firestoreDb`

interface IReservation {
  case?: number;
  room?: string;
  start?: Date;
  stdId?: string;
  student?: string;
  supervisor?: string;
}

export async function updateCloudReservationById(
  reservationId: string,
  reservation: IReservation
) {
  const reservationRef = doc(firestoreDb, "reservation", reservationId);

  try {
    if (Object.keys(reservation).length > 0)
      await updateDoc(reservationRef, reservation as { [key: string]: any });
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}
