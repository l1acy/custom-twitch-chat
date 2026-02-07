import { getGlobalChatBadges, getChannelChatBadges } from "./twitch";

type BadgeVersionsMap = Record<string, string>;
type BadgesList = Record<string, BadgeVersionsMap>;

function mapBadgeSetToVersions(badgeSet: { versions: any[]; }): BadgeVersionsMap {
  return badgeSet.versions.reduce((versions: { [x: string]: any; }, version: { id: string | number; image_url_2x: any; }) => {
    versions[version.id] = version.image_url_2x;
    return versions;
  }, {} as BadgeVersionsMap);
}

export default async function getBadges(broadcasterId: string): Promise<BadgesList> {
  const token = localStorage.getItem("botCredentials");
  const clientId = localStorage.getItem("clientId");

  if (!token || !clientId) {
    throw new Error("Missing botCredentials or clientId in localStorage");
  }

  const [globalBadges, channelBadges] = await Promise.all([
    getGlobalChatBadges(token, clientId),
    getChannelChatBadges(broadcasterId, token, clientId),
  ]);

  const badgesList: BadgesList = {};

  for (const badgeSet of globalBadges.data) {
    badgesList[badgeSet.set_id] = mapBadgeSetToVersions(badgeSet);
  }

  for (const badgeSet of channelBadges.data) {
    badgesList[badgeSet.set_id] = mapBadgeSetToVersions(badgeSet);
  }

  return badgesList;
}
