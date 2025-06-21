async function validateToken(bearerToken) {
    const response = await fetch(
        'https://id.twitch.tv/oauth2/validate',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + bearerToken,
            }
        }
    )
    return response.ok
}
async function getGlobalChatBadges(bearerToken, clientId) {
    const response = await fetch(
        'https://api.twitch.tv/helix/chat/badges/global',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + bearerToken,
                'Client-Id': clientId
            }
        }
    )
    if (!response.ok) return null

    return await response.json()
}
async function getChannelChatBadges(channelId, bearerToken, clientId) {
    const response = await fetch(
        'https://api.twitch.tv/helix/chat/badges?broadcaster_id=' + channelId,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + bearerToken,
                'Client-Id': clientId
            }
        }
    )
    if (!response.ok) return null

    return await response.json()
}

async function getUsers(login, bearerToken, clientId) {
    const response = await fetch(
        'https://api.twitch.tv/helix/users/?login=' + login,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + bearerToken,
                'Client-Id': clientId
            }
        }
    )
    if (!response.ok) return null

    return await response.json()
}

export { validateToken, getGlobalChatBadges, getChannelChatBadges, getUsers }