import db from "./setup";

export type IChat = {
  id: string;
  lastMessage: Date;
  taskSyntax: string;
  counter: number;
  data: { [key: string]: unknown };
};

const Chat = db.createCollection<IChat>("chat");

export default Chat;
