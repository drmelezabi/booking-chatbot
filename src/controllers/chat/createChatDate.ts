import { chat } from "../../config/localDb";

interface IChatData {
  lastMessage: Date;
  taskSyntax: string;
  counter: number;
  data: { [key: string]: unknown };
}

const createChatDate = async (accountId: string, chatData: IChatData) => {
  try {
    // Save the data (useful if you disable the saveOnPush)
    await chat.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await chat.reload();

    chat.push(`/${accountId}`, chatData, false);

    // Save the data (useful if you disable the saveOnPush)
    await chat.save();

    // In case you have an exterior change to the databse file and want to reload it
    // use this method
    await chat.reload();
    return;
  } catch (error: any) {
    console.log(error.message);
  }
};

export default createChatDate;
