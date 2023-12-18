import { GoogleSpreadsheet } from "google-spreadsheet";

import { accountsLists } from "../../config/googleSheet";
import createMultipleCloudAccounts from "../../controllers/accounts/add/AddAccountsToCloud";
import deleteAccounts from "../../controllers/accounts/delete/deleteCloudAccounts";
import getAccounts, {
  accountData,
} from "../../controllers/accounts/get/getCloudAccounts";
import getAccountsNoFilter from "../accounts/get/getCloudAccountsNoFilter";
interface SheetData {
  shortName: string;
  fullName: string;
  gender: "male" | "female";
  permissions: "user" | "admin" | "superAdmin";
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
          ...rows.map((row) => row.toObject() as SheetData)
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
          ...rows.map((row) => row.toObject() as SheetData)
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
        this.allManagers.push(
          ...rows.map((row) => row.toObject() as SheetData)
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
        this.allSecurities.push(
          ...rows.map((row) => row.toObject() as SheetData)
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
    return await createMultipleCloudAccounts(this.allStudents, "student");
  }

  public async uploadTeachersToFirebase(): Promise<boolean> {
    await this.loadTeachers();
    return await createMultipleCloudAccounts(this.allTeachers, "teacher");
  }

  public async uploadManagersToFirebase(): Promise<boolean> {
    await this.loadManagers();
    return await createMultipleCloudAccounts(this.allManagers, "manager");
  }

  public async uploadSecuritiesToFirebase(): Promise<boolean> {
    await this.loadSecurities();
    return await createMultipleCloudAccounts(this.allSecurities, "security");
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
    createMultipleCloudAccounts(this.noneExitedStudents, "student");
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
    createMultipleCloudAccounts(this.noneExitedTeachers, "teacher");
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
    createMultipleCloudAccounts(this.noneExitedManagers, "manager");
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
    createMultipleCloudAccounts(this.noneExitedSecurities, "manager");
    return this.noneExitedSecurities.length;
  }

  public async updateAllAccountsInFirebase(): Promise<number> {
    const securityFirebase = await getAccountsNoFilter();
    await this.loadAllAccounts();
    this.noneExitedSecurities = this.allAccounts.filter((gAccount) => {
      const isExistsAccount = securityFirebase.find(
        (fAccount) => fAccount.fullName === gAccount.fullName
      );
      if (!isExistsAccount) return true;
    });
    if (!this.noneExitedSecurities.length) return 0;
    createMultipleCloudAccounts(this.noneExitedSecurities, "manager");
    return this.noneExitedSecurities.length;
  }

  public async uploadAllAccounts(): Promise<boolean> {
    const studentsCount = await this.uploadStudentsToFirebase();
    const TeachersCount = await this.uploadTeachersToFirebase();
    const ManagersCount = await this.uploadManagersToFirebase();
    const securitiesCount = await this.uploadSecuritiesToFirebase();

    return studentsCount && TeachersCount && ManagersCount && securitiesCount;
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
