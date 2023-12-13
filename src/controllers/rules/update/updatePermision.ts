import RegisteredPhone from "../../../database/RegisteredPhone";
import getAccountIdByPass from "../../accounts/getAccountByPass";
import getAccountsString from "../../accounts/getAccounts";
import { updateCloudAccount } from "../../accounts/updateCloudAccount";

const updateAccountPermissions = async (
  add: string[],
  remove: string[]
): Promise<boolean> => {
  try {
    Promise.all(
      add.map(async (pass) => {
        const accountId = await getAccountIdByPass(pass);
        await updateCloudAccount(accountId, { admin: true });
        RegisteredPhone.update((account) => {
          if (account.recoveryId === pass) {
            account.admin = true;
          }
        });
        RegisteredPhone.save();
      })
    );

    Promise.all(
      remove.map(async (pass) => {
        const accountId = await getAccountIdByPass(pass);
        await updateCloudAccount(accountId, { admin: false });
        RegisteredPhone.update((account) => {
          if (account.recoveryId === pass) {
            account.admin = false;
          }
        });
        RegisteredPhone.save();
      })
    );

    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export default updateAccountPermissions;
