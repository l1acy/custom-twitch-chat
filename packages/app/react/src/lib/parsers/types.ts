type BadgeMap = Record<string, Record<string, string>>;

interface MessageTags {
  displayName: string | null;
  text: string | null;
  badges: (string | undefined)[];
  color: string | null;
  emotes: string[];
  time: string | null;
  id: string | null;
}

interface ParsedMessage {
  tags: MessageTags;
  fromUser: string;
  channel: string;
  message: string;
  time: string;
}

interface ParsedSystemMessage {
  action: string;
  data: Record<string, string>;
}

export type {ParsedMessage, ParsedSystemMessage, BadgeMap, MessageTags}