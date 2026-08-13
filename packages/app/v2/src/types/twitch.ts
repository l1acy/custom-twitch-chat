export interface TwitchBadge {
  name: string;
  version: string;
  imageUrl?: string;
}

export interface TwitchEmote {
  id: string;
  positions: Array<{
    start: number;
    end: number;
  }>;
}

export interface ParsedMessage {
  tags: {
    displayName: string | null;
    text: string | null;
    badges: TwitchBadge[];
    color: string | null;
    emotes: TwitchEmote[];
    time: string | null;
    id: string | null;
    [key: string]: unknown;
  };
  fromUser: string;
  channel: string;
  message: string;
  time: string;
}

export interface ParsedSystemMessage {
  action: string;
  data: Record<string, string>;
}

interface TwitchBadgeVersion {
  id: string;
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
}

export interface TwitchBadgeSet {
  set_id: string;
  versions: TwitchBadgeVersion[];
}
