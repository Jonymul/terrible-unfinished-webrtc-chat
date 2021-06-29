import { useContext } from "react";
import { ChatContext } from "../ChatContext";
import { IChatContext } from "../types/IChatContext";

export const useChatContext = (): IChatContext => {
  const chatContext = useContext(ChatContext);

  if (chatContext === undefined) {
    throw new Error("Chat Context accessed from outside of a Provider!");
  }

  return chatContext;
};
