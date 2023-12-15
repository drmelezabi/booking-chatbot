import {
  Timestamp,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  runTransaction,
  DocumentData,
} from "firebase/firestore";
import { firestoreDb } from "../../../config/firebase";

// Assuming you've initialized Firestore with `firestoreDb`

export async function cancelAllPreviousBooked() {
  const rangeStart = Timestamp.fromDate(new Date()); // Set the range start to the current time

  // Query documents where start < rangeStart and case === 0
  const q = query(
    collection(firestoreDb, "reservation"),
    where("start", "<", rangeStart)
  );

  const docSnap = await getDocs(q);

  const batch: DocumentData[] = [];

  docSnap.forEach((doc) => {
    // Update the 'case' field to 4 for each matching document
    if (doc.data().case === 0) batch.push(updateDoc(doc.ref, { case: 4 }));
  });

  try {
    // Execute the batched writes
    await runTransaction(firestoreDb, async (transaction) => {
      batch.forEach((update) => transaction.update(update.ref, update.data));
    });

    return true;
  } catch (error) {
    console.error("Error updating documents:", error);
    return false;
  }
}
