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
        this.connectToPeer(roomId);
      }
    });
  }

  private connectToPeer(peerId: string) {
    const hostConnection = this.peer.connect(peerId);
    const remotePeer = new RemotePeer(hostConnection);
    this.initRemoteDataConnection(remotePeer);
    this.remotePeers[remotePeer.peerId] = remotePeer;
  }
  
  private onSignallingConnected(id: string) {
    console.log("Connected to the signalling server. Local Peer ID is: ", id);
    this.localPeerId = id;
  }

  private initRemoteDataConnection(remotePeer: RemotePeer) {
    remotePeer.on("message", this.onRemoteMessage.bind(this));
    remotePeer.on("peerList", this.onPeerList.bind(this));
    remotePeer.on("close", this.onRemotePeerDisconnected.bind(this, remotePeer));
  }

  private onRemotePeerConnected(dataConnection: Peer.DataConnection) {
    const remotePeer = new RemotePeer(dataConnection);
    console.log("Remote peer connected", dataConnection.peer);
    this.initRemoteDataConnection(remotePeer);
    this.remotePeers[remotePeer.peerId] = remotePeer;
    this.emit("userJoin");

    remotePeer.on("open", () => {
      console.log("Sending peer list");
      remotePeer.sendPeerList(Object.keys(this.remotePeers));
    });
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

  private onPeerList(peers: string[]) {
    const knownPeers = Object.keys(this.remotePeers);
    const unknownPeers = peers.filter((peerId) => knownPeers.indexOf(peerId) === -1 && peerId !== this.localPeerId);

    console.log("Peer list received:", peers);

    unknownPeers.forEach(peerId => {
      this.connectToPeer(peerId);
    });
  }

  sendMessage (message: IMessage) {
    const peerIds = Object.keys(this.remotePeers);

    peerIds.forEach((peerId) => {
      this.remotePeers[peerId].sendMessage(message);
    })
  }
}