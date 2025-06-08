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
  </div>
</template>

<style scoped>
label {
  color: #fafafa;
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
