import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../message/ChatMessage";
import { validateToken, getUsers } from "../../../lib/twitch";
import { parseMessage } from "../../../lib/parsers/message";
import { parseSystemMessage } from "../../../lib/parsers/systemMessage";
import getBadges from "../../../lib/bages";

interface Message {
  fromUser: string;
  message: string;
  time: string;
  tags: {
    badges: (string | undefined)[];
    emotes: string[];
    color: string | null;
    username?: string;
    id?: string;
    MsgId?: string;
  };
}

function ChatView({ channel }: {channel: string}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [badgesList, setBadgesList] = useState<Record<string, any>>({});
  const websocket = useRef<WebSocket | null>(null);

  const user = "justinfan" + Math.floor(Math.random() * 100000);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const connectChat = () => {
    websocket.current = new WebSocket("wss://irc-ws.chat.twitch.tv/");

    websocket.current.onopen = () => {
      if (!websocket.current) return;

      // Подключение к Twitch IRC
      websocket.current.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
      websocket.current.send("PASS SCHMOOPIIE");
      websocket.current.send(`NICK ${user}`);
      websocket.current.send(`USER ${user} 8 * :${user}`);
      websocket.current.send(`JOIN #${channel}`);
    };

    websocket.current.onmessage = (event) => {
      const raw = event.data as string;

      // Ответ на PING
      if (raw.startsWith("PING")) {
        websocket.current?.send(raw.replace("PING", "PONG"));
        return;
      }

      // Парсинг сообщений
      const data = parseMessage(raw, badgesList);

      if (![user, "tmi.twitch.tv", `${user}.tmi.twitch.tv`].includes(data.fromUser)) {
        addMessage(data as Message);
      } else {
        const systemMsg = parseSystemMessage(raw);
        if (systemMsg.action === "CLEARCHAT") {
          setMessages([]);
          setTimeout(() =>
            addMessage({
              fromUser: "system",
              message: "Chat has been cleaned",
              time: "--:--",
              tags: {
                badges: [
                  "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/2",
                ],
                color: "#ffffff",
                emotes: [],
                username: "system",
              },
            }),
            100
          );
        } else if (systemMsg.action === "CLEARMSG") {
          const targetId = systemMsg.data.TargetMsgId;
          setMessages((prev) => prev.filter((m) => m.tags.id !== targetId));
        }
      }
    };
  };

  const checkTokenValid = async (): Promise<boolean> => {
    const token = localStorage.getItem("botCredentials");
    if (!token) return false;
    return await validateToken(token);
  };

  const loadBadges = async (broadcasterId: string) => {
    const badges = await getBadges(broadcasterId);
    setBadgesList(badges);
  };

  useEffect(() => {
    // Проверка токена и загрузка бейджей
    checkTokenValid().then((isValid) => {
      if (!isValid) {
        addMessage({
          fromUser: "system",
          message: "The token is invalid. Some functions will not be available",
          time: "--:--",
          tags: {
            badges: [
              "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/2",
            ],
            color: "#ffffff",
            emotes: [],
            username: "system",
          },
        });
      }
    });

    getUsers(channel, localStorage.getItem("botCredentials")!, localStorage.getItem("clientId")!)
      .then((res: any) => loadBadges(res.data[0].id));

    connectChat();

    // Cleanup
    return () => {
      websocket.current?.close();
    };
  }, [channel]);

  return (
    <div id="chat">
      {/* Loader */}
      {messages.length === 0 && (
        <ChatMessage
          time="--:--"
          id="chatLoader"
          username="system"
          text="Please wait, connection to Twitch chat is in progress!"
          color="#ff0000"
          badges={[
            "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/2",
          ]}
        />
      )}

      {messages.map((msg, idx) => (
        <ChatMessage
          key={idx}
          username={msg.fromUser}
          text={msg.message}
          badges={msg.tags.badges ?? []}
          color={msg.tags.color ?? "#ffffff"}
          emotes={Array.isArray(msg.tags.emotes) ? msg.tags.emotes.join(',') : ''}
          time={msg.time}
          highlight={msg.tags.MsgId === "highlighted-message"}
          id={msg.tags.id}
        />
      ))}
    </div>
  );
};

export default ChatView;
