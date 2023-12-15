import { JWT } from "google-auth-library";
import config from "../config/globalVariables";
import { GoogleSpreadsheet } from "google-spreadsheet";

const serviceAccountAuth = new JWT({
  email: config.googleServiceAccountEmail,
  key: config.googlePrivateKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const accountsLists = new GoogleSpreadsheet(
  config.accountListsSheets,
  serviceAccountAuth
);

export default serviceAccountAuth;

// const spreed = async (): Promise<void> => {
// const doc = new GoogleSpreadsheet(
//   process.env.ACCOUNT_LISTS_SHEETS as string,
//   serviceAccountAuth
//   );
// };

// await doc.loadInfo(); // loads document properties and worksheets
// console.log(doc.title);
// await doc.updateProperties({ title: "student list" });

// const handler = new StudentDataHandler();
//   handler.deleteAllAccounts();
//   await doc.loadInfo();

//   await handler.loadAllAccounts();
//   handler.uploadAllAccounts();
//   handler.getAllStudents();

//   console.log(doc.title);
//   await doc.updateProperties({ title: "account lists" });

// const doc = new GoogleSpreadsheet(
//   process.env.ACCOUNT_LISTS_SHEETS as string,
//   serviceAccountAuth
// );
