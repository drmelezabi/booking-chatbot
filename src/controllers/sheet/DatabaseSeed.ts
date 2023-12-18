import { GoogleSpreadsheet } from "google-spreadsheet";

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
    await this.doc.loadInfo(); // loads document properties and worksheets
  }

  public async loadAllAccounts(max = 100): Promise<void> {
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
  }

  public async loadStudents(max = 100): Promise<void> {
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
  }
  public async loadTeachers(max = 100): Promise<void> {
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
  }

  public async loadManagers(max = 100): Promise<void> {
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
  }
  public async loadSecurities(max = 100): Promise<void> {
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
  }

  public getAllStudents(): SheetData[] {
    return this.allStudents;
  }

  public getTeachers(): SheetData[] {
    return this.allTeachers;
  }

  public getAllManagers(): SheetData[] {
    return this.allManagers;
  }

  public getSecurities(): SheetData[] {
    return this.allSecurities;
  }

  public async uploadStudentsToFirebase(): Promise<boolean> {
    await this.loadStudents();
    return await createMultipleCloudAccounts(this.allStudents);
  }

  public async uploadTeachersToFirebase(): Promise<boolean> {
    await this.loadTeachers();
    return await createMultipleCloudAccounts(this.allTeachers);
  }

  public async uploadManagersToFirebase(): Promise<boolean> {
    await this.loadManagers();
    return await createMultipleCloudAccounts(this.allManagers);
  }

  public async uploadSecuritiesToFirebase(): Promise<boolean> {
    await this.loadSecurities();
    return await createMultipleCloudAccounts(this.allSecurities);
  }

  public async uploadAllAccounts(): Promise<boolean> {
    await this.loadAllAccounts();
    return await createMultipleCloudAccounts(this.allAccounts);
  }

  public async updateStudentsInFirebase(): Promise<number> {
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
  }

  public async updateTeachersInFirebase(): Promise<number> {
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
  }

  public async updateManagersInFirebase(): Promise<number> {
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
  }

  public async updateSecuritiesInFirebase(): Promise<number> {
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
  }

  public async updateAllAccountsInFirebase(): Promise<number> {
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
  }

  public async deleteAllStudents() {
    await deleteAccounts(["student"]);
  }

  public async deleteAllTeachers() {
    await deleteAccounts(["teacher"]);
  }

  public async deleteAllManagers() {
    await deleteAccounts(["manager"]);
  }

  public async deleteAllSecurities() {
    await deleteAccounts(["security"]);
  }

  public async deleteAllAccounts() {
    await deleteAccounts();
  }
}

const studentDataHandlers = new StudentDataHandler();

export default studentDataHandlers;
