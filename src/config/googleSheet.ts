import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

import config from "../config/globalVariables";

const serviceAccountAuth = new JWT({
  email: config.googleServiceAccountEmail,
  key: config.googlePrivateKey,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

export const accountsLists = new GoogleSpreadsheet(
  config.accountListsSheets,
  serviceAccountAuth
);

export default serviceAccountAuth;
