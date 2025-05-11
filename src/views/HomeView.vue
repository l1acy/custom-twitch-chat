<script setup lang="ts">
import { useRouter } from "vue-router";
import Input from "../components/ui/Input.vue";
import { onMounted, watch } from "vue";
import TextArea from "../components/ui/TextArea.vue";
import MessagesExample from "../components/MessagesExample.vue";

const channel = defineModel("channelName");
const css = defineModel("css");
const router = useRouter();

function openChat() {
  router.push({ path: "/chat/" + channel.value, replace: false });
}
function applyStyles() {
  const styleElement = document.getElementById("dynamic-style");
  if (styleElement) {
    styleElement.textContent = css.value;
  }

  localStorage.setItem('customCss', css.value)
}

onMounted(() => {
  const styleElement = document.createElement("style");
  styleElement.id = "dynamic-style";
  document.head.appendChild(styleElement);

  const loaded = localStorage.getItem('customCss')
  if (loaded) {
    styleElement.textContent = loaded
  }
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
      <button @click="applyStyles">Apply styles</button>
      <MessagesExample/>
    </div>
  </div>
</template>

<style scoped>
.inputWithButton {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: 8px;
  margin-top: 12px;
}
</style>
