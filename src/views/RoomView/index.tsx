import { FC } from "react";
import { useParams } from "react-router";
import { ChatContextProvider } from "../../ChatContext/components/ChatContextProvider";

export const RoomView: FC = () => {
  const { roomId } = useParams<{roomId: string}>();

  return (
    <ChatContextProvider roomId={roomId}>
      <div>This is a room {roomId}</div>
    </ChatContextProvider>
  );
}