<script setup>
import { onMounted, reactive, ref } from "vue";
import ChatMessage from "./ChatMessage.vue";

import { validateToken, getUsers } from "../lib/twitch";
import { parseMessage, parseSystemMessage } from "../lib/parsers";
import getBadges from "../lib/badges";

const props = defineProps({
  channel: String,
});

const badgesList = ref({});

const messages = reactive([]);
let websocket = null;

const user = "justinfan20762";

function isSystemMessage(msg) {
  const parts = msg.split(" ");
  return parts.some((part) => part == ":tmi.twitch.tv" || part == user);
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
    const data = parseMessage(msg.data, badgesList.value);
    if (
      ![user, "tmi.twitch.tv", `${user}.tmi.twitch.tv`].includes(
        data.fromUser.replace("\r\n", "")
      )
    ) {
      addMessage(data);
    } else {
      const systemMessage = parseSystemMessage(msg.data);

      if (systemMessage.action === "CLEARCHAT") {
        messages.splice(0);
        setTimeout(
          () =>
            addMessage({
              fromUser: "system",
              message: "Chat has been cleaned",
              tags: {
                badges: [
                  "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/2",
                ],
                emotes: "",
                color: "#ffffff",
                username: "system",
                time: "--:--",
              },
            }),
          100
        );
      } else if (systemMessage.action === "CLEARMSG") {
        const indexToRemove = messages.findIndex(
          (message) => message.tags.id === systemMessage.data.TargetMsgId
        );
        if (indexToRemove > -1) {
          messages.splice(indexToRemove, 1);
        }
      } else if (systemMessage.action === "PING") {
        websocket.send("PONG");
      }
    }
  };
}
function addMessage(message) {
  messages.push(message);
}
async function checkTokenValid() {
  const credentials = localStorage.getItem("botCredentials");
  if (!credentials) return false;

  return await validateToken(credentials);
}
async function getChatBadges(broadcaster_id) {
  badgesList.value = await getBadges(broadcaster_id);
}

onMounted(() => {
  checkTokenValid().then((isValid) => {
    if (!isValid) {
      addMessage({
        fromUser: "system",
        message: "The token is invalid. Some functions will not be available",
        tags: {
          badges: [
            "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/2",
          ],
          emotes: "",
          color: "#ffffff",
          username: "system",
          time: "--:--",
        },
      });
    }
  });

  getUsers(
    props.channel,
    localStorage.getItem("botCredentials"),
    localStorage.getItem("clientId")
  ).then((json) => getChatBadges(json.data[0].id));
  connectChat();
});
</script>

<template>
  <div id="chat">
    <ChatMessage
      time="--:--"
      id="chatLoader"
      username="system"
      text="Please wait, connection to Twitch chat is in progress!"
      userColor="#ff0000"
      :badges="[
        'https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/2',
      ]"
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
      :highlight="message.tags.MsgId == 'highlighted-message'"
      :id="message.tags.id"
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
