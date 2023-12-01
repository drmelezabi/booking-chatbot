import { PrismaClient } from "@prisma/client/index.js";
import chalk from "chalk";
//import dotenv module
import { config } from "dotenv";

//load
config();

const {
  NODE_ENV,
  PG_HOST,
  PG_PORT,
  PG_DB_DEV: DBD,
  PG_DB_TEST: DBT ,
  PG_DB: DPP,
  PG_USER,
  PG_PASSWORD,
} = process.env;


let database = NODE_ENV === "development" ? DBD : NODE_ENV === "test" ? DBT : DPP
let db = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${database}`;


// create prisma db connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: db,
    },
  },
});
export async function resetDB(print = true) {
  try {
    await prisma.teacherSubject.deleteMany();
    await prisma.studentSubject.deleteMany();
    await prisma.generalRules.deleteMany();
    await prisma.regulation.deleteMany();
    await prisma.room.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.student.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.onlineSchedule.deleteMany();
    if (!print) {
      console.log(chalk.green("Database has been successfully"));
      console.log(chalk.green("Database Link:"), chalk.blueBright(db));
    }
  } catch (error) {
    console.log(error);
  }
}


(async ()=>{
    await resetDB();
})
