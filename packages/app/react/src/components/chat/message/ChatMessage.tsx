import './ChatMessage.css'

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import emojiRegex from "emoji-regex";

interface ChatMessageProps {
  time: string;
  badges: string[];
  username: string;
  text: string;
  color: string;
  emotes?: string;
  highlight?: boolean;
}

export function ChatMessage({
  time,
  badges,
  username,
  text,
  color,
  emotes,
  highlight = false,
}: ChatMessageProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [sanitizedText, setSanitizedText] = useState("");
  const [messageClass, setMessageClass] = useState("chatMessage");

  // --- парсер смайлов и эмодзи ---
  const parseEmotes = (): string => {
    if (!emotes) return text;

    const emoteData = emotes.split("/").map((emote) => {
      const emoteList: { src: string; start: number; end: number }[] = [];
      const [src, placesString] = emote.split(":");
      placesString.split(",").forEach((place) => {
        const [start, end] = place.split("-").map(Number);
        emoteList.push({ src, start, end });
      });
      return emoteList;
    });

    const flatten = (arr: any[]): any[] =>
      arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);

    const allEmotes = flatten(emoteData).sort((a, b) => a.start - b.start).reverse();

    let formattedMessage = text;
    allEmotes.forEach(({ src, start, end }, i) => {
      formattedMessage =
        formattedMessage.slice(0, start) +
        `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${src}/default/dark/1.0" class="smile" style="animation-delay: 0.${i}s"/>` +
        formattedMessage.slice(end + 1);
    });

    return formattedMessage;
  };

  const sanitizeText = (raw: string): string =>
    DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: ["img"],
      ALLOWED_ATTR: ["src", "class", "style", "alt"],
    });

  const setAppleEmojis = (input: string) => {
    const regex = emojiRegex();
    return input.replace(regex, (emoji) => {
      const encoded = encodeURIComponent(emoji);
      return `<img 
                src="https://emojicdn.elk.sh/${encoded}?style=apple"
                class="apple-emoji"
                alt="${emoji}"
              />`;
    });
  };

  useEffect(() => {
    const parsed = parseEmotes();
    const withEmojis = setAppleEmojis(parsed);
    setSanitizedText(sanitizeText(withEmojis));

    const outTimer = setTimeout(() => setMessageClass("chatMessage messageOut"), 14000);
    const hideTimer = setTimeout(() => setIsVisible(false), 15000);

    return () => {
      clearTimeout(outTimer);
      clearTimeout(hideTimer);
    };
  }, [text, emotes]);

  if (!isVisible) return null;

  return (
    <div className={`${messageClass} ${highlight ? "highlighted" : ""}`}>
      <span>
        <span className="messageTime">{time}</span>
        <span className="userBadges">
          {badges.map((badge, i) => (
            <img key={i} src={badge} className="badge" />
          ))}
        </span>
        <span className="messageUsername" style={{ color }}>
          {username}
        </span>
        <span className="spliter">: </span>
        <span
          className="messageText"
          dangerouslySetInnerHTML={{ __html: sanitizedText }}
        />
      </span>
    </div>
  );
}
