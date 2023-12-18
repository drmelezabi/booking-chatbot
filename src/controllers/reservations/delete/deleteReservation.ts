import { deleteDoc, doc } from "firebase/firestore";

import { firestoreDb } from "../../../config/firebase";

const deleteCloudReservation = async (reservationId: string) => {
  try {
    const myDocRef = doc(firestoreDb, "reservation", reservationId);
    await deleteDoc(myDocRef);
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
  return true;
};

export default deleteCloudReservation;
