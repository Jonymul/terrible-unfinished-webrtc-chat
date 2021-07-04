import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { IMessage } from "./types/IMessage";
import { IChatContext } from "./types/IChatContext";
import { IUser, UserColor } from "./types/IUser";
import { Room } from "../RoomConnection/Room";

function randColor () {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

function randUser () {
  return `User ${Math.floor(Math.random() * 10000)}`;
}

export const useRootChatContextValue = (roomId?: string): IChatContext => {
  const [messages, _setMessages] = useState<IMessage[]>([]);
  const [name, _setName] = useState<string>(randUser());
  const [color, _setColor] = useState<UserColor>(randColor());
  const room = useMemo(() => {
    console.log("room created");
    return new Room(roomId);
  }, []);

  const meUser = useMemo<IUser>(() => ({name, color}), [name, color]);

  const sendMessage = useCallback((text: string) => {
    const newMessage: IMessage = {
      type: "text",
      text,
      author: meUser,
      createdAt: new Date()
    };

    _setMessages([...messages, newMessage]);
    room.sendMessage(newMessage);
  }, [meUser, messages, room]);  

  const setName = useCallback((name: string) => {
    _setName(name);
    // TODO: Inform peers
  }, []);

  const setColor = useCallback((color: UserColor) => {
    _setColor(color);
    // TODO: Inform peers
  }, []);

  const handleMessageReceived = useCallback((newMessage: IMessage) => {
    _setMessages([...messages, newMessage]);
  }, [messages]);

  useEffect(() => {
    room.on("message", handleMessageReceived);

    return () => {
      room.off("message", handleMessageReceived);
    };
  }, [room]);

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
