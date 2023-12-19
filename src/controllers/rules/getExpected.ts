import { dict } from "../../config/diff";
import ErrorHandler from "../../config/errorhandler";
import db from "../../database/setup";

interface IExpected {
  [key: string]: string;
}

const getDictionary = (): IExpected => {
  try {
    const dictionary = db.get<IExpected>("dictionary");

    if (!dictionary) {
      db.set("dictionary", dict);
      db.save();
      return db.get<IExpected>("dictionary");
    }

    return dictionary;
  } catch (error) {
    throw ErrorHandler(error, "getDictionary");
  }
};

export default getDictionary;
