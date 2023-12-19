import { deleteDoc, doc } from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";

const deleteCloudReservation = async (reservationId: string) => {
  try {
    const myDocRef = doc(firestoreDb, "reservation", reservationId);
    await deleteDoc(myDocRef);
    return true;
  } catch (error) {
    throw ErrorHandler(error, "deleteCloudReservation");
  }
};

export default deleteCloudReservation;
