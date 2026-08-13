import { useEffect, useState, useCallback } from 'react';
import { TwitchApiClient } from '../lib/twitch';

const broadcasterIdCache = new Map<string, string>();

interface UseBroadcasterIdResult {
  broadcasterId: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useBroadcasterId(
  client: TwitchApiClient | null,
  channel: string | null
): UseBroadcasterIdResult {
  const [broadcasterId, setBroadcasterId] = useState<string | null>(() => {
    if (channel) {
      return broadcasterIdCache.get(channel.toLowerCase()) || null;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBroadcasterId = useCallback(async () => {
    if (!client || !channel) {
      setBroadcasterId(null);
      setLoading(false);
      return;
    }

    const normalized = channel.toLowerCase();

    if (broadcasterIdCache.has(normalized)) {
      setBroadcasterId(broadcasterIdCache.get(normalized)!);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const users = await client.getUsers(normalized);
      if (!users || users.length === 0) {
        throw new Error(`User "${channel}" not found`);
      }
      const id = users[0].id;
      broadcasterIdCache.set(normalized, id);
      setBroadcasterId(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setBroadcasterId(null);
    } finally {
      setLoading(false);
    }
  }, [client, channel]);

  useEffect(() => {
    if (client && channel) {
      fetchBroadcasterId();
    } else {
      setBroadcasterId(null);
      setError(null);
      setLoading(false);
    }
  }, [client, channel, fetchBroadcasterId]);

  return {
    broadcasterId,
    loading,
    error,
    refetch: fetchBroadcasterId,
  };
}