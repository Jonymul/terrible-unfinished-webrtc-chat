import { IUser } from "./IUser";

export interface IMessage {
  type: "text",
  text: string,
  author: IUser,
  createdAt: Date,
}
