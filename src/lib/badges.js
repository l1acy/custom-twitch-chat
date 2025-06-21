import { getGlobalChatBadges, getChannelChatBadges } from "./twitch";

async function getBadges(broadcaster_id) {
  let badgesList = {};
  const globalBadges = await getGlobalChatBadges(
    localStorage.getItem("botCredentials"),
    localStorage.getItem("clientId")
  );
  const channelBadges = await getChannelChatBadges(
    broadcaster_id,
    localStorage.getItem("botCredentials"),
    localStorage.getItem("clientId")
  );

  globalBadges.data.forEach((badgesSet) => {
    badgesList[badgesSet.set_id] = badgesSet.versions.reduce((acc, version) => {
      acc[version.id] = version.image_url_2x;
      return acc;
    }, {});
  });
  channelBadges.data.forEach((badgesSet) => {
    badgesList[badgesSet.set_id] = badgesSet.versions.reduce((acc, version) => {
      acc[version.id] = version.image_url_2x;
      return acc;
    }, {});
  });

  return badgesList;
}

export default getBadges