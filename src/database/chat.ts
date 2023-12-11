import db from "./setup";

type chat = {
  lastMessage: Date;
  taskSyntax: string;
  counter: number;
  data: { [key: string]: unknown };
};

const Chat = db.createCollection<chat>("chat");

export default Chat;
