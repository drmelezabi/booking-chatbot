import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
  DocumentData,
  deleteDoc,
} from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";
import { getRestOfToday } from "../date/getRestOfToday";

// Assuming you've initialized Firestore with `firestoreDb`

export async function cancelTodaysBooked() {
  const RestOfToday = await getRestOfToday();
  if (!RestOfToday) return true;

  const rangeStart = Timestamp.fromDate(RestOfToday.start);
  const rangeEnd = Timestamp.fromDate(RestOfToday.end);

  const finalData: DocumentData[] = [];

  const q = query(
    collection(firestoreDb, "appointment"),
    where("start", ">=", rangeStart),
    where("start", "<", rangeEnd)
  );

  const docSnap = await getDocs(q);

  try {
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
    console.error("Error updating documents:", error);
    return false;
  }
}
