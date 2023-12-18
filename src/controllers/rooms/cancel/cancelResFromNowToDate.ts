import {
  DocumentData,
  Timestamp,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { firestoreDb } from "../../../config/firebase";

// Assuming you've initialized Firestore with `firestoreDb`

export async function cancelResFromNowToDate(customDate: Date) {
  const start = new Date();
  start.setDate(start.getDate());
  start.setHours(start.getHours(), 0, 0, 0);

  const rangeStart = Timestamp.fromDate(start);
  const rangeEnd = Timestamp.fromDate(customDate);

  const finalData: DocumentData[] = [];

  const q = query(
    collection(firestoreDb, "reservation"),
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
