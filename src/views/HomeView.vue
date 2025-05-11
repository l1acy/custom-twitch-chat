<script setup lang="ts">
import { useRouter } from "vue-router";
import Input from "../components/ui/Input.vue";

const channel = defineModel();
const router = useRouter()

function openChat() {
    router.push({ path: '/chat/' + channel.value, replace: false})
}
</script>

<template>
  <div class="card">
    <h1>Welcome to CustomTwitchChat</h1>
    <div class="open_chat">
    <Input
      id="nameInput"
      label="Channel"
      placeholder="mzlff"
      v-model="channel"
    />
    <button @click="openChat" :disabled="!channel">Open chat</button>
    </div>
  </div>
</template>

<style scoped>
.open_chat {
    display: flex;
    flex-direction: column;
    max-width: 250px;
    gap: 8px;
    margin-top: 12px;
}
</style>