import { firestoreDb } from "../../config/firebase";
import { doc, deleteDoc } from "firebase/firestore";

const deleteReservation = async (reservationId: string) => {
  try {
    const myDocRef = doc(firestoreDb, "appointment", reservationId);
    await deleteDoc(myDocRef);
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
  return true;
};

export default deleteReservation;
