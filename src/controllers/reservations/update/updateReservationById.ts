import { doc, updateDoc } from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
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
  try {
    const reservationRef = doc(firestoreDb, "reservation", reservationId);

    if (Object.keys(reservation).length > 0)
      await updateDoc(
        reservationRef,
        reservation as { [key: string]: number | string | Date }
      );
    return true;
  } catch (error) {
    throw ErrorHandler(error, "updateCloudReservationById");
  }
}
