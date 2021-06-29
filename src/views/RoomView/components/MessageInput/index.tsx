import { ChangeEvent, FC, useCallback, useMemo, useState } from "react"
import { useChatContext } from "../../../../ChatContext/hooks/useChatContext";
import "./index.css";

export const MessageInput: FC<{ className?: string }> = (props) => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChatContext();
  const canClickSend = useMemo(() => message.length > 0, [message]);

  const handleMessageOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const handleSendMessage = useCallback(() => {
    sendMessage(message);
    setMessage("");
  }, [message, sendMessage]);

  return (
    <div className={`messageInput ${props.className}`}>
      <input className="messageInput__field" type="text" placeholder="Message" value={message} onChange={handleMessageOnChange} />
      <div className="messageInput__buttonWrapper">
        <button onClick={handleSendMessage} disabled={!canClickSend}>Send</button>
      </div>
    </div>
  );
}