import { chat } from "../../config/localDb";

interface IChatData {
  lastMessage?: Date;
  taskSyntax?: string;
  counter?: number;
  data?: { [key: string]: unknown };
}

const updateChatData = async (
  accountId: string,
  chatObject: IChatData,
  override: boolean = false
) => {
  try {
    const data: { [key: string]: IChatData } = {};
    data[accountId] = chatObject;
    await chat.push(`/cash`, data, override);
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

export default updateChatData;
