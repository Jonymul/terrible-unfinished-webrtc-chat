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
        const hostConnection = peer.connect(roomId);
        this.onRemotePeerConnected(hostConnection);
      }
    });
  }
  
  private onSignallingConnected(id: string) {
    console.log("Connected to the signalling server. Local Peer ID is: ", id);
    this.localPeerId = id;
  }

  private onRemotePeerConnected(dataConnection: Peer.DataConnection) {
    console.log("Remote peer connected", dataConnection.peer);
    const remotePeer = new RemotePeer(dataConnection);

    
    remotePeer.on("message", this.onRemoteMessage.bind(this));
    remotePeer.on("close", this.onRemotePeerDisconnected.bind(this, remotePeer));
    this.remotePeers[dataConnection.peer] = remotePeer;
    this.emit("userJoin");
  }

  private onRemotePeerDisconnected(remotePeer: RemotePeer) {
    console.log("Remote peer disconnected", remotePeer.peerId);
    remotePeer.off("message", this.onRemoteMessage);

    delete this.remotePeers[remotePeer.peerId];
    this.emit("userLeave");
  }

  private onRemoteMessage(message: IMessage) {
    this.emit("message", message);
  }

  sendMessage (message: IMessage) {
    const peerIds = Object.keys(this.remotePeers);

    peerIds.forEach((peerId) => {
      this.remotePeers[peerId].sendMessage(message);
    })
  }
}