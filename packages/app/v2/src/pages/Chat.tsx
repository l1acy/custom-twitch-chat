import "./Chat.css";

import Message from "@/components/chat/Message";
import CHAT_POSITION_CLASSES, {
  CHAT_VIEW_POSITION_CLASSES,
} from "@/lib/chatPosition";
import IRCClient from "@/lib/irc";
import { parseMessage } from "@/lib/parsers";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/stores/config";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

interface MessageData {
  time: number;
  badges: string[];
  username: string;
  usernameColor: string;
  message: string;
  emotesRaw: string;
  isHighlight: boolean;
}

function ChatPage() {
  const { channelName } = useParams();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const config = useConfigStore((state) => state.config);

  if (!channelName) {
    return (
      <p>
        You must specify channel name. Go to /chat/{"<"}channel-name{">"}
      </p>
    );
  }

  const clientRef = useRef<IRCClient | null>(null);

  useEffect(() => {
    const irc = new IRCClient("wss://irc-ws.chat.twitch.tv/", channelName);
    clientRef.current = irc;

    irc.on("message", (data) => {
      const message = parseMessage(data.raw, {});
      if (!message) return;

      setMessages((prev) => [
        ...prev.slice(-100),
        {
          time: Number(message.tags.time) ?? 0,
          badges: [],
          username: message.fromUser,
          usernameColor: message.tags.color ?? "",
          message: message.message,
          emotesRaw: "",
          isHighlight: false,
        },
      ]);
    });
    irc.on("action", (command) => {
      if (command === "CLEARCHAT") {
        console.clear();
      }
    });

    irc.connect();

    return () => {
      irc.disconnect();
      clientRef.current = null;
    };
  }, [channelName]);

  return (
    <div
      className={cn(
        "chat-view",
        CHAT_VIEW_POSITION_CLASSES[config.chatPosition],
      )}
    >
      {messages.map((msg) => (
        <Message
          time={new Date(msg.time).toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})}
          badges={msg.badges}
          username={msg.username}
          usernameColor={msg.usernameColor}
          message={msg.message}
          emotesRaw={msg.emotesRaw}
          isHighlight={msg.isHighlight}
          key={crypto.randomUUID()}
        />
      ))}
    </div>
  );
}

export default ChatPage;
