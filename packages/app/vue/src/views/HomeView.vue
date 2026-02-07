<script setup>
import Input from "../components/ui/Input.vue";
import TextArea from "../components/ui/TextArea.vue";
import MessagesExample from "../components/MessagesExample.vue";

import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

import getItem from "../lib/storage";
import { applyStyles } from "../lib/styles";
import { changeChatPosition } from "../lib/styles";

const css = defineModel("css");
const chatPosition = ref(getItem('chatPosition', 'right'));

const channel = defineModel("channelName");
const clientId = defineModel('clientId')
const clientSecret = defineModel('clientSecret')

const router = useRouter();

function openChat() {
  router.push({ path: "/chat/" + channel.value, replace: false });
}

function updateStyles() {
  localStorage.setItem("customCss", css.value ?? '');
  applyStyles(css.value ?? undefined);
}
function updateChatPosition(position) {
  chatPosition.value = position
  changeChatPosition(position)
}
const beraerTokenLoading = ref(false)
const beraerTokenStatus = ref('NONE')

function placeholderLoading() {
  beraerTokenLoading.value = true
  async function getData() {
    const response = await fetch(
      'https://id.twitch.tv/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            "client_id": clientId.value,
            "client_secret": clientSecret.value,
            "grant_type": "client_credentials"
          }
        )
      }
    )
    if (!response.ok) {
      beraerTokenStatus.value = 'ERROR'
      beraerTokenLoading.value = false
    } else {
      beraerTokenStatus.value = 'SUCCESSFUL'
    }
    const json = await response.json()
    localStorage.setItem(
      'botCredentials',
      json.access_token.toString()
    )
    localStorage.setItem(
      'clientId',
      clientId.value
    )
  }
  getData().then(() => beraerTokenLoading.value = false)
}

onMounted(() => {
  css.value = getItem("customCss", "")
});
</script>

<template>
  <div class="card">
    <h1>Welcome to CustomTwitchChat</h1>
    <div class="inputWithButton">
      <Input
        id="nameInput"
        label="Channel"
        placeholder="mzlff"
        v-model="channel"
      />
      <button @click="openChat" :disabled="!channel">Open chat</button>
    </div>
    <hr />
    <div class="inputWithButton">
      <h2>Customization</h2>
      <TextArea v-model="css" label="Custom CSS" placeholder="..."></TextArea>
      <button @click="updateStyles">Apply styles</button>
      <MessagesExample class="chatExample"/>
    </div>
    <div class="inputWithButton chatPosition">
      <label>Chat position</label>
      <div class="select">
        <button
          :class="chatPosition == 'left' ? 'active' : ''"
          @click="updateChatPosition('left')"
        >
          On left
        </button>
        <button
          :class="chatPosition == 'right' ? 'active' : ''"
          @click="updateChatPosition('right')"
        >
          On right
        </button>
      </div>
    </div>
    <hr />
    <div class="inputWithButton">
      <h2>Bot settings</h2>
      <p>Specify the data of the bot so that you can always receive the latest badges from twitch. And also that you would have access to channel badges, for example, the badge of a paid subscriber. <a href="https://dev.twitch.tv/console/apps/create">Create bot here</a></p>
      <Input label="Client Id" type="password" v-model="clientId"/>
      <Input label="Client secret" type="password" v-model="clientSecret"/>
      <span class="warning" v-if="beraerTokenError">
        Cannot get beraer token. Check bot credentials
      </span>
      <span class="warning" v-if="beraerTokenStatus == 'ERROR'">
        Cannot get beraer token. Check bot credentials
      </span>
      <span class="successful" v-if="beraerTokenStatus == 'SUCCESSFUL'">
        Token getting successful
      </span>
      <button @click="placeholderLoading()" :disabled="!clientId || !clientSecret">
        <span v-if="!beraerTokenLoading">Get beraer token</span>
        <img v-if="beraerTokenLoading" src="/src/assets/icons/spinner.svg" class="spiner" width="13" height="13"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
.warning {
  background-color: rgba(215, 166, 87, 0.25);
  padding: 12px 32px;
  color: #ffffff;
  border-radius: 15px;
}
.successful {
  background-color: rgba(87, 215, 102, 0.25);
  padding: 12px 32px;
  color: #ffffff;
  border-radius: 15px;
}
label {
  color: #fafafa;
}
p {
  color: rgb(189, 189, 189);
}
.select {
  background-color: #c4c4c4;
  border-radius: 10px;
  display: inline-block;
}
.select > button {
  background: none;
}
.select > .active {
  background-color: #ffffff;
}

.inputWithButton {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: 8px;
  margin-top: 12px;
}
.chatPosition {
  z-index: 999;
  position: relative;
}
.chatExample {
  z-index: 0;
}
</style>
