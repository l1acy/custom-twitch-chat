import { splitText } from "../split";
import { toCamelCase } from "../toCamelCase";
import type { BadgeMap, MessageTags, ParsedMessage } from "./types";

export function parseMessage(msg: string, badgesList: BadgeMap): ParsedMessage {
  const tags: MessageTags = {
    displayName: null,
    text: null,
    badges: [],
    color: null,
    emotes: [],
    time: null,
    id: null,
  };

  let fromUser = '';
  let channel = '';
  let message = '';

  const isStartChar = (text: string, char: string) => text[0] === char;

  const parts = splitText(msg, ' ', 4);

  parts.forEach((part) => {
    if (isStartChar(part, '@')) {
      // Tags
      const splittedTags = part.split(';');
      splittedTags.forEach((tag) => {
        const [key, value] = tag.split('=');
        if (!key || value === undefined) return;

        let finalValue: any = value;

        if (key === 'badges') {
          finalValue = value
            .split(',')
            .map((badge) => {
              const [badgeName, badgeVersion] = badge.split('/');
              return badgeName in badgesList ? badgesList[badgeName][badgeVersion] : undefined;
            })
            .filter(Boolean);
        }

        tags[toCamelCase(key) as keyof MessageTags] = finalValue;
      });
    }

    if (isStartChar(part, ':') && !fromUser) {
      // From user
      fromUser = part.slice(1).split('!')[0];
    } else if (isStartChar(part, '#')) {
      // Channel
      channel = part.slice(1);
    } else if (isStartChar(part, ':') && fromUser) {
      // Message content
      message = part.slice(1);
    }
  });

  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;

  return {
    tags,
    fromUser,
    channel,
    message,
    time,
  };
}