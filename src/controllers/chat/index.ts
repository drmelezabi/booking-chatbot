import WAWebJS from "whatsapp-web.js";
import getChatData from "./getChatData";
import deleteChatData from "./deleteChatData";

interface IChatData {
  lastMessage: Date;
  taskSyntax: string;
  counter: number;
  data: { [key: string]: unknown };
}

export default async function chatCash(
  message: WAWebJS.Message,
  accountId: string
): Promise<IChatData> {
  let counter = 0;
  let data: { [key: string]: unknown } = {};
  let lastMessage: Date = new Date();
  let taskSyntax: string = "";

  if (!message.body.startsWith("!")) {
    const chat = await getChatData(accountId);

    if (!chat)
      return {
        counter,
        data,
        lastMessage,
        taskSyntax,
      };

    return chat;
  } else {
    await deleteChatData(accountId);

    return {
      counter,
      data,
      lastMessage,
      taskSyntax,
    };
  }
}
