import { IMessage } from "../../ChatContext/types/IMessage";
import { IUser } from "../../ChatContext/types/IUser";

export type PeerMessage = {
  type: "MESSAGE";
  payload: {
    message: IMessage;
  };
} | {
  type: "USER_INFO";
  payload: {
    user: IUser;
  };
} | {
  type: "PEER_LIST";
  payload: {
    peers: string[];
  };
};
