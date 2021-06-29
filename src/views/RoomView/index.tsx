import { FC } from "react";
import { useParams } from "react-router";
import { ChatContextProvider } from "../../ChatContext/components/ChatContextProvider";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import "./index.css";

export const RoomView: FC = () => {
  const { roomId } = useParams<{roomId: string}>();

  return (
    <ChatContextProvider roomId={roomId}>
      <div className="room">
        <MessageList className="room__messageList" />
        <MessageInput className="room__input" />
      </div>
    </ChatContextProvider>
  );
}