const splitText = (text, separator, limit) => {
  const splitted = text.split(separator, limit)
  let splittedLenght = 0
  splitted.forEach((part) => splittedLenght = splittedLenght + part.length)
  const otherText = text.slice(splittedLenght + limit)

  splitted.push(otherText)
  return splitted
}
const toCamelCase = (text) => {
  const parts = text.split('-')
  if (parts.length === 1) return text
  const strings = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  return strings.join('')
}

function parseMessage(msg, badgesList) {
  let tags = {
    displayName: null,
    text: null,
    badges: [],
    color: null,
    emotes: [],
    time: null,
    id: null
  }
  let fromUser = ''
  let channel = ''
  let message = ''

  const isStartChar = (text, char) => text[0] === char

  const parts = splitText(msg, ' ', 4)
  parts.forEach((part) => {
    if (isStartChar(part, '@')) {
      const splitted_tags = part.split(';')
      splitted_tags.forEach((tag) => {
        const tag_parts = tag.split('=')
        if (tag_parts.length == 2) {
          let [ key, value ] = tag_parts
          if (key == 'badges') {
            const badges = value.split(',').map((badge) => {
              const [badgeName, badgeVersion] = badge.split('/')
              if (badgeName in badgesList) {
                return badgesList[badgeName][badgeVersion]
              }
            })
            value = badges
          }
          tags[toCamelCase(key)] = value
        }
      })
    }
    if (isStartChar(part, ':') && !fromUser) {
      fromUser = part.slice(1).split('!')[0]
    }
    if (isStartChar(part, '#')) {
      channel = part.slice(1)
    }
    if (isStartChar(part, ':') && fromUser) {
      message = part.slice(1)
    }
  })

  const date = new Date();
  const minutes = String(date.getMinutes());
  const hours = String(date.getHours());

  const time = hours + ":" + (minutes.length > 1 ? minutes : `0${minutes}`);

  const data = {
    tags: tags,
    fromUser: fromUser,
    channel: channel,
    message: message,
    time: time
  }
  return data
}

function parseSystemMessage(msg) {
  const parts = splitText(msg, ' ', 3)
  const parsed = {
    'action': parts.length == 3 ? parts[0] : parts[2],
    'data': {}
  }
  parts[0].split(';').forEach(
      (tag) => {
        const [key, value] = tag.split('=')

        parsed.data[toCamelCase(key)] = value
      }
    )

  return parsed
}

export { parseMessage, parseSystemMessage }