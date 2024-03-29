import {
  DocumentData,
  Timestamp,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import ErrorHandler from "../../../config/errorhandler";
import { firestoreDb } from "../../../config/firebase";
import { getRestOfToday } from "../../date/getRestOfToday";

// Assuming you've initialized Firestore with `firestoreDb`

export async function cancelTodaysCloudReservations() {
  try {
    const RestOfToday = getRestOfToday();
    if (!RestOfToday) return true;

    const rangeStart = Timestamp.fromDate(RestOfToday.start);
    const rangeEnd = Timestamp.fromDate(RestOfToday.end);

    const finalData: DocumentData[] = [];

    const q = query(
      collection(firestoreDb, "reservation"),
      where("start", ">=", rangeStart),
      where("start", "<", rangeEnd)
    );

    const docSnap = await getDocs(q);

    // Execute the batched writes
    docSnap.forEach(async (doc) => {
      // Push data to finalData
      finalData.push(doc.data());

      // Delete the document
      const docRef = doc.ref;
      await deleteDoc(docRef);
    });

    return true;
  } catch (error) {
    throw ErrorHandler(error, "cancelTodaysCloudReservations");
  }
}
