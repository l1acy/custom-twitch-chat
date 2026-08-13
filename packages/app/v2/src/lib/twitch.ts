import type { TwitchBadgeSet } from "@/types/twitch";

const TWITCH_API_BASE = "https://api.twitch.tv/helix";
const TWITCH_AUTH_BASE = "https://id.twitch.tv/oauth2";

interface ApiResponse<T> {
  data: T[];
}

interface TwitchBadgeVersion {
  id: string;
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
}

interface TwitchBadgeSetResponse {
  set_id: string;
  versions: TwitchBadgeVersion[];
}

interface TwitchUserResponse {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

export class TwitchApiClient {
  private readonly accessToken: string;
  private readonly clientId: string;
  constructor(accessToken: string, clientId: string) {
    this.accessToken = accessToken;
    this.clientId = clientId;
  }

  async validateToken(): Promise<boolean> {
    const response = await fetch(`${TWITCH_AUTH_BASE}/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.ok;
  }

  async getGlobalBadges(): Promise<TwitchBadgeSet[]> {
    const response = await fetch(`${TWITCH_API_BASE}/chat/badges/global`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) return [];
    const json = (await response.json()) as ApiResponse<TwitchBadgeSetResponse>;
    return json.data || [];
  }

  async getChannelBadges(broadcasterId: string): Promise<TwitchBadgeSet[]> {
    const url = new URL(`${TWITCH_API_BASE}/chat/badges`);
    url.searchParams.set("broadcaster_id", broadcasterId);

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });
    if (!response.ok) return [];
    const json = (await response.json()) as ApiResponse<TwitchBadgeSetResponse>;
    return json.data || [];
  }

  async getUsers(login: string | string[]): Promise<TwitchUserResponse[]> {
    const logins = Array.isArray(login) ? login : [login];
    const url = new URL(`${TWITCH_API_BASE}/users`);
    for (const l of logins) {
      url.searchParams.append("login", l);
    }

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });
    if (!response.ok) return [];
    const json = (await response.json()) as ApiResponse<TwitchUserResponse>;
    return json.data || [];
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Client-Id": this.clientId,
    };
  }
}
