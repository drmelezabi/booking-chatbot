import { chat } from "../../config/localDb";

interface IChatData {
  [key: string]: {
    lastMessage: Date;
    taskSyntax: string;
    counter: number;
    data: { [key: string]: unknown };
  };
}

const getChatData = async (
  accountId: string
): Promise<IChatData | undefined> => {
  try {
    await chat.save();
    await chat.reload();
    return await chat.getObject<IChatData>(`/${accountId}`);
  } catch (error: any) {
    console.log(error.message);
    return undefined;
  }
};

export default getChatData;
