import { useEffect, useState, useCallback } from 'react';
import { TwitchApiClient } from '../lib/twitch';
import type { TwitchBadgeSet } from '@/types/twitch';

export type BadgeDictionary = Record<string, Record<string, string>>;

interface CachedBadges {
  data: BadgeDictionary;
  timestamp: number;
}

const DEFAULT_CACHE_TTL = 1 * 60 * 60 * 1000;

interface UseBadgesOptions {
  client: TwitchApiClient | null;
  broadcasterId: string | null;
  cacheTTL?: number;
  autoFetch?: boolean;
}

interface UseBadgesResult {
  badges: BadgeDictionary | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

function buildBadgeDictionary(
  globalSets: TwitchBadgeSet[],
  channelSets: TwitchBadgeSet[]
): BadgeDictionary {
  const dict: BadgeDictionary = {};
  const combined = [...globalSets, ...channelSets];
  for (const set of combined) {
    dict[set.set_id] = {};
    for (const version of set.versions) {
      dict[set.set_id][version.id] = version.image_url_2x || version.image_url_1x;
    }
  }
  return dict;
}

export function useBadges({
  client,
  broadcasterId,
  cacheTTL = DEFAULT_CACHE_TTL,
  autoFetch = true,
}: UseBadgesOptions): UseBadgesResult {
  const [badges, setBadges] = useState<BadgeDictionary | null>(() => {
    if (broadcasterId) {
      try {
        const raw = localStorage.getItem(`badges_${broadcasterId}`);
        if (raw) {
          const cached: CachedBadges = JSON.parse(raw);
          if (Date.now() - cached.timestamp < cacheTTL) {
            return cached.data;
          }
        }
      } catch {}
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBadges = useCallback(async (ignoreCache = false) => {
    if (!client || !broadcasterId) {
      setBadges(null);
      setLoading(false);
      return;
    }

    if (!ignoreCache) {
      try {
        const raw = localStorage.getItem(`badges_${broadcasterId}`);
        if (raw) {
          const cached: CachedBadges = JSON.parse(raw);
          if (Date.now() - cached.timestamp < cacheTTL) {
            setBadges(cached.data);
            return;
          }
        }
      } catch {}
    }

    setLoading(true);
    setError(null);

    try {
      const [globalBadges, channelBadges] = await Promise.all([
        client.getGlobalBadges(),
        client.getChannelBadges(broadcasterId),
      ]);

      const dict = buildBadgeDictionary(globalBadges, channelBadges);
      setBadges(dict);

      const cachePayload: CachedBadges = {
        data: dict,
        timestamp: Date.now(),
      };
      localStorage.setItem(`badges_${broadcasterId}`, JSON.stringify(cachePayload));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);

      try {
        const raw = localStorage.getItem(`badges_${broadcasterId}`);
        if (raw) {
          const cached: CachedBadges = JSON.parse(raw);
          setBadges(cached.data);
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  }, [client, broadcasterId, cacheTTL]);

  const clearCache = useCallback(() => {
    if (broadcasterId) {
      localStorage.removeItem(`badges_${broadcasterId}`);
      setBadges(null);
    }
  }, [broadcasterId]);

  useEffect(() => {
    if (autoFetch && client && broadcasterId) {
      fetchBadges(false);
    } else {
      setBadges(null);
      setError(null);
      setLoading(false);
    }
  }, [client, broadcasterId, autoFetch, fetchBadges]);

  return {
    badges,
    loading,
    error,
    refetch: () => fetchBadges(true),
    clearCache,
  };
}