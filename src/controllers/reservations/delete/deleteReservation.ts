import { firestoreDb } from "../../../config/firebase";
import { doc, deleteDoc } from "firebase/firestore";

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
