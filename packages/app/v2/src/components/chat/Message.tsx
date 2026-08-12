import { useConfigStore } from '@/stores/config';
import './Message.css'

interface Props {
  time: string;
  badges: string[];
  username: string;
  usernameColor: string;
  message: string;
  emotesRaw: string;
  isHighlight: boolean;
}

function Message({
  time,
  badges,
  username,
  usernameColor,
  message,
  emotesRaw,
  isHighlight,
}: Props) {
  const config = useConfigStore();


  return (
    <div className="chat-message">
      <article>
        <span className="chat-message__time">{time}</span>
        {/* <span className="chat-message__badges">
                    <img />
                </span> */}
        <span
          className="chat-message__username"
          style={{ color: usernameColor }}
        >
          {username}
        </span>
        <span className="chat-message__splitter">{': '}</span>
        <span className={['chat-message__text', ((isHighlight && !config.config.ignoreHighlight) && 'chat-message__highlight')].join(' ')}>{message}</span>
      </article>
    </div>
  );
}

export default Message;
