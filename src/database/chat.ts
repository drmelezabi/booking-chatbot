import db from "./setup";

type chat = {
  id: string;
  lastMessage: Date;
  taskSyntax: string;
  counter: number;
  data: { [key: string]: unknown };
};

const Chat = db.createCollection<chat>("chat");

export default Chat;
