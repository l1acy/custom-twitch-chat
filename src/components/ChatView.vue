<script setup>
import { onMounted, reactive } from "vue";
import ChatMessage from "./ChatMessage.vue";

const props = defineProps({
  channel: String,
});

const messages = reactive([]);
let websocket = null

function connectChat() {
  websocket = new WebSocket("wss://irc-ws.chat.twitch.tv/");
  websocket.onopen = () => {
    document.getElementById("chatLoader").remove();
    websocket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
    websocket.send("PASS SCHMOOPIIE");
    websocket.send("NICK justinfan20762");
    websocket.send("USER justinfan20762 8 * :justinfan20762");
    websocket.send("JOIN #" + props.channel);
  };
  websocket.onmessage = (msg) => {
    console.log(msg.data);
    const data = msg.data;

    const sysMessage = data.split(" :");
    console.log(sysMessage);
    if (sysMessage.length > 1 && sysMessage[0] == "PING") {
      websocket.send("PONG");
    }

    let result = {};
    if (!data) return;
    data.split(";").map((element) => {
      const data = element.split("=");
      if (data.length > 1) {
        result[data[0]] = data[1];
      } else {
        const message = result["user-type"];
        result["user-type"] = message + ";" + data[0];
      }
    });
    result["message"] = result["user-type"].split(":").slice(2).join(":");
    if (result["vip"]) {
      result["message"] = result["vip"].split(":").slice(2).join(":");
    }
    result["username"] = result["display-name"];
    if (result["badges".split(",")]) {
      result["badges"] = result["badges"]
        .split(",")
        .map((badge) => badge.replace("/1", ""));
    }

    const date = new Date();
    const minutes = String(date.getMinutes());
    const hours = String(date.getHours());

    const time = hours + ":" + (minutes.length > 1 ? minutes : `0${minutes}`);

    result["time"] = time;

    if (result["display-name"] && result["message"]) {
      addMessage(result);
    }
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
      :username="message.username"
      :text="message.message"
      :badges="message.badges"
      :userColor="message.color"
      :emotes="message.emotes"
      :time="message.time"
      :id="message.id"
    />
  </div>
</template>

<style>
#chat {
  position: absolute;
  right: 24px;
  bottom: 12px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  max-width: 800px;
  min-width: 300px;

  overflow-y: hidden;
}
</style>
