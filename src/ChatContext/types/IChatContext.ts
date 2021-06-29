import { IMessage } from "./IMessage";
import { UserColor } from "./IUser";

export interface IChatContext {
  messages: IMessage[],
  sendMessage(message: string): void;
  preferences: {
    name: string;
    setName(name: string): void;
    color: UserColor;
    setColor(color: UserColor): void;
  };
};
