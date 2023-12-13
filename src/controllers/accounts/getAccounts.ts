import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestoreDb } from "../../config/firebase";

const getAccountsString = async (): Promise<string> => {
  try {
    const finalData: DocumentData = [];

    const q = query(
      collection(firestoreDb, "account"),
      where("type", "!=", "student")
    );

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      finalData.push({
        code: doc.data().pass,
        name: doc.data().name,
        admin: doc.data().admin,
      });
    });

    if (!finalData.length) return "لا يوجد أي حسابات";

    const array = (
      finalData as { code: string; name: string; admin: boolean }[]
    )
      .map(
        (account) =>
          `الاسم: ${account.name}\nرمز التحكم: ${account.code}\nإدارة: ${
            account.admin ? "نعم" : "لا"
          }\n`
      )
      .join("\n~~~~~~~~~~~~~~~`\n");

    return "*قائمة الصلاحيات*\n\n".concat(array);
  } catch (error) {
    console.log("getAccountsString", error);
    return "حدث خطأ";
  }
};

export default getAccountsString;
