import { FC } from "react";
import { Provider, useRootChatContextValue } from "../ChatContext";

export type ChatContextProviderProps = {
  roomId: string;
}

export const ChatContextProvider: FC<ChatContextProviderProps> = (props) => {
  const contextValue = useRootChatContextValue(props.roomId);

  return <Provider value={contextValue}>{props.children}</Provider>;
}