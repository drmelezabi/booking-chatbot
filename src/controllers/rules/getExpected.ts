import { expected } from "../../config/localDb";

interface IExpected {
  [key: string]: string;
}

const getExpected = async (): Promise<IExpected> => {
  return new Promise((resolve, reject) => {
    try {
      const ExpectedData = expected.getObject<IExpected>("/");
      resolve(ExpectedData);
    } catch (error: any) {
      console.log(error.message);
      reject(error);
    }
  });
};

export default getExpected;
