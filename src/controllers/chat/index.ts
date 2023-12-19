import WAWebJS from "whatsapp-web.js";

import ErrorHandler from "../../config/errorhandler";
import Chat from "../../database/chat";
import RegisteredPhone from "../../database/RegisteredPhone";

const remove = (accountId: string) => {
  const length = Chat.fetchMany((c) => c.id === accountId).length;
  for (let index = 0; index < length; index++) {
    Chat.remove((c) => c.id === accountId);
    Chat.save();
  }
};

const chat = (client: WAWebJS.Client, message: WAWebJS.Message) => {
  try {
    let counter = 0;
    let data: { [key: string]: unknown } = {};
    let lastMessage: Date = new Date();
    let taskSyntax = "";
    let accountId = "";

    if (message.body.startsWith("!")) {
      const isExist = RegisteredPhone.fetch(
        (account) => account.chatId === message.from
      );
      Chat.save();
      if (isExist) {
        accountId = isExist.accountId;
        remove(accountId);
      }
    } else {
      const isExist = RegisteredPhone.fetch(
        (account) => account.chatId === message.from
      );
      Chat.save();
      if (isExist) accountId = isExist.accountId;
      const chanData = Chat.fetch((u) => u.id === accountId);
      Chat.save();
      if (/^[إآأا]لغاء/.test(message.body)) {
        if (chanData) {
          remove(accountId);
          const msg = `تم الإلغاء`;
          client.sendMessage(message.from, msg);
          return;
        }
      } else {
        const oneMinutes = 1 * 60 * 1000;
        if (chanData) {
          if (
            new Date() > new Date(new Date(lastMessage).getTime() + oneMinutes)
          ) {
            if (chanData) taskSyntax = chanData.taskSyntax;
            remove(accountId);
          } else {
            if (message.hasMedia && !chanData.data.waitFile) {
              message.delete(true);
              client.sendMessage(message.from, `لسنا في انتظار أي ملفات`);
              return;
            }
            counter = chanData.counter;
            data = chanData.data;
            lastMessage = chanData.lastMessage;
            taskSyntax = chanData.taskSyntax;
          }
        }
      }
    }
    Chat.save();

    return { counter, data, taskSyntax };
  } catch (error) {
    throw ErrorHandler(error, "chat");
  }
};

export default chat;
