import { DocumentData, collection, getDocs, query } from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

export const getRoomsAvailable = async (from?: Date, to?: Date) => {
  try {
    const collectionRef = collection(firestoreDb, "rooms");
    const finalData: DocumentData[] = [];
    const q = query(collectionRef);
    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      finalData.push(doc.data());
    });
    return finalData;
  } catch (error) {
    console.log("get", error);
  }
};
