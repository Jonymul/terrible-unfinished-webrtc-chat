import { createContext, useCallback, useMemo, useState } from "react";
import { IMessage } from "./types/IMessage";
import { IChatContext } from "./types/IChatContext";
import { IUser, UserColor } from "./types/IUser";

export const useRootChatContextValue = (roomId: string): IChatContext => {
  const [messages, _setMessages] = useState<IMessage[]>([]);
  const [name, _setName] = useState<string>("User");
  const [color, _setColor] = useState<UserColor>("red");

  const meUser = useMemo<IUser>(() => ({name, color}), [name, color]);

  const sendMessage = useCallback((text: string) => {
    const newMessage: IMessage = {
      type: "text",
      text,
      author: meUser,
      createdAt: new Date()
    };

    _setMessages([...messages, newMessage]);
    // TODO: Inform peers
  }, [meUser, messages]);

  const setName = useCallback((name: string) => {
    _setName(name);
    // TODO: Inform peers
  }, []);

  const setColor = useCallback((color: UserColor) => {
    _setColor(color);
    // TODO: Inform peers
  }, []);

  return {
    messages,
    sendMessage,
    preferences: {
      name,
      setName,
      color,
      setColor,
    }
  }
}

export const ChatContext = createContext<IChatContext | undefined>(undefined);
export const Consumer = ChatContext.Consumer;
export const Provider = ChatContext.Provider;
