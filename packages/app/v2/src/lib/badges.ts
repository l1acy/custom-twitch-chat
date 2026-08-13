import type { TwitchBadgeSet } from "@/types/twitch";
import { TwitchApiClient } from "./twitch";

export type BadgeDictionary = Record<string, Record<string, string>>;

interface CachedBadges {
  data: BadgeDictionary;
  timestamp: number;
}

const CACHE_TTL = 1 * 60 * 60 * 1000;

export async function getBadges(
  broadcasterId: string,
  accessToken: string,
  clientId: string,
): Promise<BadgeDictionary> {
  const twitch = new TwitchApiClient(accessToken, clientId);

  const globalData = await twitch.getGlobalBadges();
  const channelData = await twitch.getChannelBadges(broadcasterId);

  const combined = [...globalData, ...channelData];
  return buildBadgeDictionary(combined);
}

function buildBadgeDictionary(sets: TwitchBadgeSet[]): BadgeDictionary {
  const dict: BadgeDictionary = {};
  for (const set of sets) {
    dict[set.set_id] = {};
    for (const version of set.versions) {
      dict[set.set_id][version.id] =
        version.image_url_2x || version.image_url_1x;
    }
  }
  return dict;
}

export function getCachedBadges(broadcasterId: string): BadgeDictionary | null {
  try {
    const raw = localStorage.getItem(`badges_${broadcasterId}`);
    if (!raw) return null;
    const cached: CachedBadges = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      return cached.data;
    }
    return cached.data;
  } catch {
    return null;
  }
}

export function cacheBadges(
  broadcasterId: string,
  data: BadgeDictionary,
): void {
  const payload: CachedBadges = { data, timestamp: Date.now() };
  localStorage.setItem(`badges_${broadcasterId}`, JSON.stringify(payload));
}
