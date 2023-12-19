import { doc, setDoc } from "firebase/firestore";

import ErrorHandler from "../../config/errorhandler";
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
    throw ErrorHandler(error, "addDocument");
  }
};

export default addDocument;
