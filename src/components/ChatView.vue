<script setup>
import { onMounted, reactive } from "vue";
import ChatMessage from "./ChatMessage.vue";
import PointsRevard from "./PointsRevard.vue";

const props = defineProps({
  channel: String,
});

const messages = reactive([]);
let websocket = null

const user = 'justinfan20762'

function parseMessage(msg) {
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
  const toCamelCase = (text) => {
    const parts = text.split('-')
    if (parts.length === 1) return text
    const strings = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    return strings.join('')
  }
  const splitText = (text, separator, limit) => {
    const splitted = text.split(separator, limit)
    let splittedLenght = 0
    splitted.forEach((part) => splittedLenght = splittedLenght + part.length)
    const otherText = text.slice(splittedLenght + limit)

    splitted.push(otherText)
    return splitted
  }

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
              return {
                name: badgeName,
                version: badgeVersion
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
function isSystemMessage(msg) {
  const parts = msg.split(' ')
  return parts.some(part => part == ':tmi.twitch.tv' || part == user)
}

function connectChat() {
  websocket = new WebSocket("wss://irc-ws.chat.twitch.tv/");
  websocket.onopen = () => {
    document.getElementById("chatLoader").remove();
    websocket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
    websocket.send("PASS SCHMOOPIIE");
    websocket.send(`NICK ${user}`);
    websocket.send(`USER ${user} 8 * :${user}`);
    websocket.send("JOIN #" + props.channel);
  };
  websocket.onmessage = (msg) => {
    if (isSystemMessage(msg.data)) {
      return
    }
    const data = parseMessage(msg.data)
    if (data.fromUser == 'tmi.twitch.tv\r\n' && msg.data.split(' :')[0] == 'PING') {
      websocket.send('PONG')
      return
    }
    if (data.fromUser == user) {
      return
    } 
    addMessage(data)
  };
}
function addMessage(message) {
  messages.push(message)
}

onMounted(() => {
  connectChat()
})
</script>

<template>
  <div id="chat">
    <ChatMessage
      time="--:--"
      id="chatLoader"
      username="l1acy"
      text="Пожалуйста подождите, выполняется подключение к чату Twitch!"
      userColor="#ff0000"
      :badges="['system']"
    />
    <ChatMessage
      v-for="(message, index) in messages"
      :key="index"
      :username="message.fromUser"
      :text="message.message"
      :badges="message.tags.badges"
      :color="message.tags.color"
      :emotes="message.tags.emotes"
      :time="message.time"
      :id="message.id"
    />
  </div>
</template>

<style>
#chat {
  position: absolute;
  right: var(--chatRight);
  left: var(--chatLeft);
  bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  max-width: 800px;
  min-width: 300px;

  overflow-y: hidden;
}
</style>
