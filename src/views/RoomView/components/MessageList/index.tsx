import { FC } from "react"
import { useChatContext } from "../../../../ChatContext/hooks/useChatContext";
import { IMessage } from "../../../../ChatContext/types/IMessage";
import "./index.css";

const Message: FC<{message: IMessage}> = ({message}) => {
  return (
    <div className="message">
      <div className="message__author" style={{ color: message.author.color }}>{message.author.name}</div>
      <div className="message__body">{message.text}</div>
    </div>
  );
}

export const MessageList: FC<{ className?: string }> = (props) => {
  const { messages } = useChatContext();

  return (
    <div className={props.className}>
      <ul className="messageList">
        {messages.map((m) => (
          <li className="messageList__message"><Message message={m} /></li>
        ))}
      </ul>
    </div>
  );
}