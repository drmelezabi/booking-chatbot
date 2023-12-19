import ErrorHandler from "../../../config/errorhandler";
import RegisteredPhone from "../../../database/RegisteredPhone";
import getAccountIdByPass from "../../accounts/get/getAccountByPass";
import { updateCloudAccount } from "../../accounts/update/updateCloudAccount";

const updateAccountPermissions = async (
  upgrade: string[],
  downgrade: string[]
): Promise<boolean> => {
  try {
    Promise.all(
      upgrade.map(async (pass) => {
        const accountId = await getAccountIdByPass(pass);
        const accountData = RegisteredPhone.fetch(
          (account) => account.accountId === accountId
        );

        if (!accountData) throw new Error("accountData should not be nullable");

        let NewStatus: "user" | "admin" | "superAdmin";

        switch (accountData.permissions) {
          case "user":
            NewStatus = "admin";
            break;
          default:
            NewStatus = "superAdmin";
            break;
        }
        await updateCloudAccount(accountId, { permissions: NewStatus });
        RegisteredPhone.update((account) => {
          if (account.recoveryId === pass) {
            account.permissions = NewStatus;
          }
        });
        RegisteredPhone.save();
      })
    );

    Promise.all(
      downgrade.map(async (pass) => {
        const accountId = await getAccountIdByPass(pass);
        const accountData = RegisteredPhone.fetch(
          (account) => account.accountId === accountId
        );

        if (!accountData) throw new Error("accountData should not be nullable");

        let NewStatus: "user" | "admin" | "superAdmin";

        switch (accountData.permissions) {
          case "superAdmin":
            NewStatus = "admin";
            break;
          default:
            NewStatus = "user";
            break;
        }
        await updateCloudAccount(accountId, { permissions: NewStatus });
        RegisteredPhone.update((account) => {
          if (account.recoveryId === pass) {
            account.permissions = NewStatus;
          }
        });
        RegisteredPhone.save();
      })
    );

    return true;
  } catch (error) {
    throw ErrorHandler(error, "updateAccountPermissions");
  }
};

export default updateAccountPermissions;
