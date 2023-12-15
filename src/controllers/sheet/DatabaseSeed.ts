import createMultipleCloudAccounts from "../../controllers/accounts/add/AddAccountsToCloud";
import { accountData } from "../../controllers/accounts/get/getCloudAccounts";
import deleteAccounts from "../../controllers/accounts/delete/deleteCloudAccounts";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { accountsLists } from "../../config/googleSheet";
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

  public async loadAllAccounts(max: number = 100): Promise<void> {
    await this.loadStudents(max);
    await this.loadTeachers(max);
    await this.loadManagers(max);
    await this.loadSecurities(max);
  }

  public async loadStudents(max: number = 100): Promise<void> {
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
  public async loadTeachers(max: number = 100): Promise<void> {
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

  public async loadManagers(max: number = 100): Promise<void> {
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
  public async loadSecurities(max: number = 100): Promise<void> {
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
    return await createMultipleCloudAccounts(this.allStudents, "student");
  }

  public async uploadTeachersToFirebase(): Promise<boolean> {
    return await createMultipleCloudAccounts(this.allTeachers, "teacher");
  }

  public async uploadManagersToFirebase(): Promise<boolean> {
    return await createMultipleCloudAccounts(this.allManagers, "manager");
  }

  public async uploadSecuritiesToFirebase(): Promise<boolean> {
    return await createMultipleCloudAccounts(this.allSecurities, "security");
  }

  public async addAndDeleteSheet(): Promise<void> {
    const newSheet = await this.doc.addSheet({ title: "another sheet" });
    await newSheet.delete();
  }

  public async updateStudentsInFirebase(
    sheetAccounts: SheetData[],
    firebaseAccount: accountData[]
  ): Promise<number> {
    this.noneExitedStudents = sheetAccounts.filter((gAccount) => {
      const isExistsAccount = firebaseAccount.find(
        (fAccount) => fAccount.fullName === gAccount.fullName
      );
      if (!isExistsAccount) return true;
    });
    if (!this.noneExitedStudents.length) return 0;
    createMultipleCloudAccounts(this.noneExitedStudents, "student");
    return this.noneExitedStudents.length;
  }

  public async updateTeachersInFirebase(
    sheetAccounts: SheetData[],
    firebaseAccount: accountData[]
  ): Promise<number> {
    this.noneExitedTeachers = sheetAccounts.filter((gAccount) => {
      const isExistsAccount = firebaseAccount.find(
        (fAccount) => fAccount.fullName === gAccount.fullName
      );
      if (!isExistsAccount) return true;
    });
    if (!this.noneExitedTeachers.length) return 0;
    createMultipleCloudAccounts(this.noneExitedTeachers, "teacher");
    return this.noneExitedTeachers.length;
  }

  public async updateManagersInFirebase(
    sheetAccounts: SheetData[],
    firebaseAccount: accountData[]
  ): Promise<number> {
    this.noneExitedManagers = sheetAccounts.filter((gAccount) => {
      const isExistsAccount = firebaseAccount.find(
        (fAccount) => fAccount.fullName === gAccount.fullName
      );
      if (!isExistsAccount) return true;
    });
    if (!this.noneExitedManagers.length) return 0;
    createMultipleCloudAccounts(this.noneExitedManagers, "manager");
    return this.noneExitedManagers.length;
  }

  public async updateSecuritiesInFirebase(
    sheetAccounts: SheetData[],
    firebaseAccount: accountData[]
  ): Promise<number> {
    this.noneExitedSecurities = sheetAccounts.filter((gAccount) => {
      const isExistsAccount = firebaseAccount.find(
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

export default StudentDataHandler;
