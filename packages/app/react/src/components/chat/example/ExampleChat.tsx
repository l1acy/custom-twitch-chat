import '../../../styles/chat/Chat.css'

import { useState } from "react";
import { ChatMessage } from "../message/ChatMessage";

interface Message {
  username: string;
  message: string;
  badges: string[];
  time: string;
  id: string;
  color: string;
  emotes?: string;
}

export function ExampleChat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = () => {
    const randomMessages = [
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Adipiscing elit quisque faucibus ex sapien vitae pellentesque. Vitae pellentesque sem placerat in id cursus mi. Cursus mi pretium tellus duis convallis tempus leo. Tempus leo eu aenean sed diam urna tempor. Urna tempor pulvinar vivamus fringilla lacus nec metus.",
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.",
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    ];

    const randomNicknames = ["nghtowl", "l1acy", "twitch", "nely", "wuuump", "glichly"];

    const randomColors = [
      "ff0000",
      "008000",
      "b22222",
      "ff7f50",
      "9acd32",
      "ff4500",
      "2e8b57",
      "daa520",
      "d2691e",
      "5f9ea0",
      "1e90ff",
      "ff69b4",
      "8a2be2",
      "00ff7f",
    ];

    const newMessage: Message = {
      username: randomNicknames[Math.floor(Math.random() * randomNicknames.length)],
      message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
      badges: [],
      time: "12:34",
      id: Math.random().toString(36).substring(2, 9),
      color: "#" + randomColors[Math.floor(Math.random() * randomColors.length)],
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div>
      <div id="chat">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            username={msg.username}
            text={msg.message}
            badges={msg.badges}
            color={msg.color}
            time={msg.time}
            emotes={msg.emotes}
            highlight={false}
          />
        ))}
      </div>

      <div className="flex-row" style={{ marginTop: 16 }}>
        <button onClick={addMessage}>Add message</button>
        <button onClick={clearMessages}>Clear messages</button>
      </div>
    </div>
  );
}

export default ExampleChat;