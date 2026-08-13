import type { ParsedMessage, ParsedSystemMessage, TwitchBadge, TwitchEmote } from '@/types/twitch';


function splitWithRemainder(text: string, separator: string, limit: number): string[] {
  const parts = text.split(separator, limit);
  const usedLength = parts.reduce((sum, part) => sum + part.length, 0);
  const remainder = text.slice(usedLength + limit);
  parts.push(remainder);
  return parts;
}


function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}


function startsWithChar(str: string, char: string): boolean {
  return str.length > 0 && str[0] === char;
}


function parseTags(tagString: string, badgesList: Record<string, Record<string, TwitchBadge>>): Record<string, unknown> {
  const tags: Record<string, unknown> = {};
  const pairs = tagString.split(';');

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (!key) continue;

    const camelKey = kebabToCamel(key);

    if (key === 'badges' && value) {
      tags.badges = parseBadges(value, badgesList);
    } else {
      tags[camelKey] = value || null;
    }
  }

  return tags;
}


function parseBadges(badgeString: string, badgesList: Record<string, Record<string, TwitchBadge>>): TwitchBadge[] {
  if (!badgeString) return [];

  return badgeString.split(',').map((badge) => {
    const [name, version] = badge.split('/');
    const badgeData = badgesList[name]?.[version];
    return {
      name,
      version,
      imageUrl: badgeData?.imageUrl,
    };
  });
}

function parseEmotes(emoteString: string): TwitchEmote[] {
  if (!emoteString) return [];

  return emoteString.split('/').map((emote) => {
    const [id, positions] = emote.split(':');
    if (!id || !positions) return null;

    const positionList = positions.split(',').map((pos) => {
      const [start, end] = pos.split('-').map(Number);
      return { start, end };
    });

    return { id, positions: positionList };
  }).filter((emote): emote is TwitchEmote => emote !== null);
}


function extractUsername(prefix: string): string {
  const exclamationIndex = prefix.indexOf('!');
  return exclamationIndex !== -1 ? prefix.slice(1, exclamationIndex) : prefix.slice(1);
}


export function parseMessage(
  rawMessage: string,
  badgesList: Record<string, Record<string, TwitchBadge>> = {}
): ParsedMessage | null {
  if (!rawMessage.trim()) return null;

  const parts = splitWithRemainder(rawMessage, ' ', 4);

  let tagString = '';
  let prefix = '';
  let channel = '';
  let messageText = '';

  for (const part of parts) {
    if (startsWithChar(part, '@')) {
      tagString = part;
    } else if (startsWithChar(part, ':') && !prefix) {
      prefix = part;
    } else if (startsWithChar(part, '#')) {
      channel = part.slice(1);
    } else if (startsWithChar(part, ':') && prefix) {
      messageText = part.slice(1);
    }
  }

  const tags = tagString ? parseTags(tagString.slice(1), badgesList) : {};
  const username = prefix ? extractUsername(prefix) : '';

  if (tags.emotes && typeof tags.emotes === 'string') {
    tags.emotes = parseEmotes(tags.emotes as string);
  }

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;

  return {
    tags: {
      displayName: (tags['displayName'] as string) || null,
      text: (tags['text'] as string) || null,
      badges: (tags.badges as TwitchBadge[]) || [],
      color: (tags['color'] as string) || null,
      emotes: (tags.emotes as TwitchEmote[]) || [],
      time: (tags['tmiSentTs'] as string) || null,
      id: (tags['id'] as string) || null,
      ...tags,
    },
    fromUser: username,
    channel,
    message: messageText,
    time,
  };
}

export function parseSystemMessage(rawMessage: string): ParsedSystemMessage | null {
  if (!rawMessage.trim()) return null;

  const parts = splitWithRemainder(rawMessage, ' ', 3);

  const action = parts.length === 3 ? parts[0] : parts[2] || '';
  const tagString = parts[0] || '';

  const data: Record<string, string> = {};
  const pairs = tagString.split(';');

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      data[kebabToCamel(key)] = value || '';
    }
  }

  return { action, data };
}