import EventEmitter from "eventemitter3";
import Peer from "peerjs";
import { IMessage } from "../ChatContext/types/IMessage";
import { IUser } from "../ChatContext/types/IUser";
import { PeerMessage } from "./types/PeerMessage";

export class RemotePeer extends EventEmitter<"message" | "userInfo" | "close"> {
  private dataConnection: Peer.DataConnection;
  userInfo: IUser | undefined;
  peerId: string;

  constructor (dataConnection: Peer.DataConnection) {
    super();
    this.dataConnection = dataConnection;
    this.peerId = dataConnection.peer;

    dataConnection.on("data", this.onDataConnectionData.bind(this));
    dataConnection.on("close", this.onDataConnectionClose.bind(this));
  }

  onDataConnectionData (data: PeerMessage) {
    if (!("type" in data) || !("payload" in data)) {
      return; // Unknown 
    }

    switch(data.type) {
      case "MESSAGE":
        this.emit("message", data.payload.message);
        break;
      case "USER_INFO":
        this.userInfo = data.payload.user;
        this.emit("userInfo", data.payload.user);
        break;
      default:
        return; // Unknown type
    }
  }

  private onDataConnectionClose () {
    this.emit("close");
  }

  sendMessage (message: IMessage) {
    this.dataConnection.send({
      type: "MESSAGE",
      payload: {
        message: message,
      },
    } as PeerMessage)
  }
}