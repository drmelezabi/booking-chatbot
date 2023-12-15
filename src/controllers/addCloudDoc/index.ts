import { doc, setDoc } from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

const addDocument = async (
  collectionName: string,
  documentId: string,
  data: object
) => {
  try {
    const document = doc(firestoreDb, collectionName, documentId);
    await setDoc(document, data);
    return true;
  } catch (error) {
    console.log("add", error);
    return false;
  }
};

export default addDocument;
