import { EventEmitter } from "eventemitter3";
import Peer from "peerjs";
import { IMessage } from "../ChatContext/types/IMessage";
import { RemotePeer } from "./RemotePeer";

export class Room extends EventEmitter<"userJoin" | "userLeave" | "message"> {
  private peer: Peer;
  private remotePeers: Record<string, RemotePeer> = {};
  localPeerId: string | undefined;

  constructor (roomId?: string) {
    super();
    const peer = this.peer = new Peer({ debug: 3 });
    peer.on("open", this.onSignallingConnected.bind(this));
    peer.on("connection", this.onRemotePeerConnected.bind(this));

    peer.on("open", () => {
      if (roomId !== undefined) {
        peer.connect(roomId);
      }
    });
  }
  
  private onSignallingConnected(id: string) {
    console.log("Connected to the signalling server. Local Peer ID is: ", id);
    this.localPeerId = id;
  }

  private onRemotePeerConnected(dataConnection: Peer.DataConnection) {
    console.log("Remote peer connected", dataConnection.label);
    const remotePeer = new RemotePeer(dataConnection);

    
    remotePeer.on("message", this.onRemoteMessage.bind(this));
    remotePeer.on("close", () => this.onRemotePeerDisconnected(dataConnection));
    this.remotePeers[dataConnection.label] = remotePeer;
    this.emit("userJoin");
  }

  private onRemotePeerDisconnected(dataConnection: Peer.DataConnection) {
    const remotePeer = this.remotePeers[dataConnection.label];
    remotePeer.off("message", this.onRemoteMessage);

    delete this.remotePeers[dataConnection.label];
    this.emit("userLeave");
  }

  private onRemoteMessage(message: IMessage) {
    console.log("message received", message);
    this.emit("message", message);
  }

  sendMessage (message: IMessage) {
    const peerIds = Object.keys(this.remotePeers);
    console.log("Sending message to peers:", peerIds);

    peerIds.forEach((peerId) => {
      this.remotePeers[peerId].sendMessage(message);
    })
  }
}