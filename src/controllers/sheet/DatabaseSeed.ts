import { GoogleSpreadsheet } from "google-spreadsheet";

import ErrorHandler from "../../config/errorhandler";
import { accountsLists } from "../../config/googleSheet";
import createMultipleCloudAccounts from "../../controllers/accounts/add/AddAccountsToCloud";
import deleteAccounts from "../../controllers/accounts/delete/deleteCloudAccounts";
import getAccounts from "../../controllers/accounts/get/getCloudAccounts";
import getAccountsNoFilter from "../accounts/get/getCloudAccountsNoFilter";
interface SheetData {
  shortName: string;
  fullName: string;
  gender: "male" | "female";
  permissions: "user" | "admin" | "superAdmin";
  type: "teacher" | "student" | "manager" | "security";
}

class StudentDataHandler {
  private doc: GoogleSpreadsheet = accountsLists;

  private teachers: string[] = ["teachers"];
  private managers: string[] = ["managers"];
  private securities: string[] = ["securities"];
  private gradeSheets: string[] = [
    "first-grade-c",
    "first-grade-y",
    "second-grade-c",
    "second-grade-y",
    "third-grade-c",
    "third-grade-y",
    "fourth-grade-c",
    "fourth-grade-y",
  ];

  private allAccounts: SheetData[] = [];
  private allStudents: SheetData[] = [];
  private allTeachers: SheetData[] = [];
  private allManagers: SheetData[] = [];
  private allSecurities: SheetData[] = [];

  private noneAllAccounts: SheetData[] = [];
  private noneExitedStudents: SheetData[] = [];
  private noneExitedTeachers: SheetData[] = [];
  private noneExitedManagers: SheetData[] = [];
  private noneExitedSecurities: SheetData[] = [];

  public async loadInfo() {
    try {
      await this.doc.loadInfo(); // loads document properties and worksheets
    } catch (error) {
      throw ErrorHandler(error, "loadInfo");
    }
  }

  public async loadAllAccounts(max = 100): Promise<void> {
    try {
      await this.loadStudents(max);
      await this.loadTeachers(max);
      await this.loadManagers(max);
      await this.loadSecurities(max);

      this.allAccounts = [
        ...this.allStudents,
        ...this.allTeachers,
        ...this.allManagers,
        ...this.allSecurities,
      ];
    } catch (error) {
      throw ErrorHandler(error, "loadAllAccounts");
    }
  }

  public async loadStudents(max = 100): Promise<void> {
    try {
      const promises = this.gradeSheets.map(async (sheet) => {
        const gradeSheet = this.doc.sheetsByTitle[sheet];
        if (gradeSheet) {
          await gradeSheet.loadCells(`A1:D${max}`);
          const rows = await gradeSheet.getRows();
          this.allStudents.push(
            ...rows.map((row) => {
              return { ...row.toObject(), type: "student" } as SheetData;
            })
          );
        }
      });

      await Promise.all(promises);
    } catch (error) {
      throw ErrorHandler(error, "loadStudents");
    }
  }
  public async loadTeachers(max = 100): Promise<void> {
    try {
      const promises = this.teachers.map(async (sheet) => {
        const gradeSheet = this.doc.sheetsByTitle[sheet];
        if (gradeSheet) {
          await gradeSheet.loadCells(`A1:D${max}`);
          const rows = await gradeSheet.getRows();
          this.allTeachers.push(
            ...rows.map((row) => {
              return { ...row.toObject(), type: "teacher" } as SheetData;
            })
          );
        }
      });
      await Promise.all(promises);
    } catch (error) {
      throw ErrorHandler(error, "loadTeachers");
    }
  }

  public async loadManagers(max = 100): Promise<void> {
    try {
      await this.doc.loadInfo(); // loads document properties and worksheets
      const promises = this.managers.map(async (sheet) => {
        const gradeSheet = this.doc.sheetsByTitle[sheet];
        if (gradeSheet) {
          await gradeSheet.loadCells(`A1:D${max}`);
          const rows = await gradeSheet.getRows();
          this.allTeachers.push(
            ...rows.map((row) => {
              return { ...row.toObject(), type: "manager" } as SheetData;
            })
          );
        }
      });

      await Promise.all(promises);
    } catch (error) {
      throw ErrorHandler(error, "loadManagers");
    }
  }
  public async loadSecurities(max = 100): Promise<void> {
    try {
      const promises = this.securities.map(async (sheet) => {
        const gradeSheet = this.doc.sheetsByTitle[sheet];
        if (gradeSheet) {
          await gradeSheet.loadCells(`A1:D${max}`);
          const rows = await gradeSheet.getRows();
          this.allTeachers.push(
            ...rows.map((row) => {
              return { ...row.toObject(), type: "security" } as SheetData;
            })
          );
        }
      });
      await Promise.all(promises);
    } catch (error) {
      throw ErrorHandler(error, "loadSecurities");
    }
  }

  public getAllStudents(): SheetData[] {
    try {
      return this.allStudents;
    } catch (error) {
      throw ErrorHandler(error, "getAllStudents");
    }
  }

  public getTeachers(): SheetData[] {
    try {
      return this.allTeachers;
    } catch (error) {
      throw ErrorHandler(error, "getTeachers");
    }
  }

  public getAllManagers(): SheetData[] {
    try {
      return this.allManagers;
    } catch (error) {
      throw ErrorHandler(error, "getAllManagers");
    }
  }

  public getSecurities(): SheetData[] {
    try {
      return this.allSecurities;
    } catch (error) {
      throw ErrorHandler(error, "getSecurities");
    }
  }

  public async uploadStudentsToFirebase(): Promise<boolean> {
    try {
      await this.loadStudents();
      return await createMultipleCloudAccounts(this.allStudents);
    } catch (error) {
      throw ErrorHandler(error, "uploadStudentsToFirebase");
    }
  }

  public async uploadTeachersToFirebase(): Promise<boolean> {
    try {
      await this.loadTeachers();
      return await createMultipleCloudAccounts(this.allTeachers);
    } catch (error) {
      throw ErrorHandler(error, "uploadTeachersToFirebase");
    }
  }

  public async uploadManagersToFirebase(): Promise<boolean> {
    try {
      await this.loadManagers();
      return await createMultipleCloudAccounts(this.allManagers);
    } catch (error) {
      throw ErrorHandler(error, "uploadManagersToFirebase");
    }
  }

  public async uploadSecuritiesToFirebase(): Promise<boolean> {
    try {
      await this.loadSecurities();
      return await createMultipleCloudAccounts(this.allSecurities);
    } catch (error) {
      throw ErrorHandler(error, "uploadSecuritiesToFirebase");
    }
  }

  public async uploadAllAccounts(): Promise<boolean> {
    try {
      await this.loadAllAccounts();
      return await createMultipleCloudAccounts(this.allAccounts);
    } catch (error) {
      throw ErrorHandler(error, "uploadAllAccounts");
    }
  }

  public async updateStudentsInFirebase(): Promise<number> {
    try {
      const studentFirebase = await getAccounts("student");
      await this.loadStudents();
      this.noneExitedStudents = this.allStudents.filter((gAccount) => {
        const isExistsAccount = studentFirebase.find(
          (fAccount) => fAccount.fullName === gAccount.fullName
        );
        if (!isExistsAccount) return true;
      });
      if (!this.noneExitedStudents.length) return 0;
      createMultipleCloudAccounts(this.noneExitedStudents);
      return this.noneExitedStudents.length;
    } catch (error) {
      throw ErrorHandler(error, "updateStudentsInFirebase");
    }
  }

  public async updateTeachersInFirebase(): Promise<number> {
    try {
      const teacherFirebase = await getAccounts("teacher");
      await this.loadTeachers();
      this.noneExitedTeachers = this.allTeachers.filter((gAccount) => {
        const isExistsAccount = teacherFirebase.find(
          (fAccount) => fAccount.fullName === gAccount.fullName
        );
        if (!isExistsAccount) return true;
      });
      if (!this.noneExitedTeachers.length) return 0;
      createMultipleCloudAccounts(this.noneExitedTeachers);
      return this.noneExitedTeachers.length;
    } catch (error) {
      throw ErrorHandler(error, "updateTeachersInFirebase");
    }
  }

  public async updateManagersInFirebase(): Promise<number> {
    try {
      const managerFirebase = await getAccounts("manager");
      await this.loadManagers();
      this.noneExitedManagers = this.allManagers.filter((gAccount) => {
        const isExistsAccount = managerFirebase.find(
          (fAccount) => fAccount.fullName === gAccount.fullName
        );
        if (!isExistsAccount) return true;
      });
      if (!this.noneExitedManagers.length) return 0;
      createMultipleCloudAccounts(this.noneExitedManagers);
      return this.noneExitedManagers.length;
    } catch (error) {
      throw ErrorHandler(error, "updateManagersInFirebase");
    }
  }

  public async updateSecuritiesInFirebase(): Promise<number> {
    try {
      const securityFirebase = await getAccounts("security");
      await this.loadSecurities();
      this.noneExitedSecurities = this.allSecurities.filter((gAccount) => {
        const isExistsAccount = securityFirebase.find(
          (fAccount) => fAccount.fullName === gAccount.fullName
        );
        if (!isExistsAccount) return true;
      });
      if (!this.noneExitedSecurities.length) return 0;
      createMultipleCloudAccounts(this.noneExitedSecurities);
      return this.noneExitedSecurities.length;
    } catch (error) {
      throw ErrorHandler(error, "updateSecuritiesInFirebase");
    }
  }

  public async updateAllAccountsInFirebase(): Promise<number> {
    try {
      const securityFirebase = await getAccountsNoFilter();
      await this.loadAllAccounts();
      this.noneAllAccounts = this.allAccounts.filter((gAccount) => {
        const isExistsAccount = securityFirebase.find(
          (fAccount) => fAccount.fullName === gAccount.fullName
        );
        if (!isExistsAccount) return true;
      });
      if (!this.noneAllAccounts.length) return 0;
      createMultipleCloudAccounts(this.noneAllAccounts);
      return this.noneAllAccounts.length;
    } catch (error) {
      throw ErrorHandler(error, "updateAllAccountsInFirebase");
    }
  }

  public async deleteAllStudents() {
    try {
      await deleteAccounts(["student"]);
    } catch (error) {
      throw ErrorHandler(error, "deleteAllStudents");
    }
  }

  public async deleteAllTeachers() {
    try {
      await deleteAccounts(["teacher"]);
    } catch (error) {
      throw ErrorHandler(error, "deleteAllTeachers");
    }
  }

  public async deleteAllManagers() {
    try {
      await deleteAccounts(["manager"]);
    } catch (error) {
      throw ErrorHandler(error, "deleteAllManagers");
    }
  }

  public async deleteAllSecurities() {
    try {
      await deleteAccounts(["security"]);
    } catch (error) {
      throw ErrorHandler(error, "deleteAllSecurities");
    }
  }

  public async deleteAllAccounts() {
    try {
      await deleteAccounts();
    } catch (error) {
      throw ErrorHandler(error, "deleteAllAccounts");
    }
  }
}

const studentDataHandlers = new StudentDataHandler();

export default studentDataHandlers;
