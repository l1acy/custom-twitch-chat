<script setup>
import { reactive } from 'vue';
import ChatMessage from './ChatMessage.vue';

const messages = reactive([])

function addMessage() {
    messages.push(
        {
            username: 'zhuzha',
            message: 'Hello, I am so happy! and many many many text, for testing multilining',
            badges: ['admin'],
            time: '12:34',
            id: 'ao4'
        }
    )
}
function clearMessages() {
    messages.splice(0)
}

</script>

<template>
    <div id="chat">

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
  <div class="flex-row">
    <button @click="addMessage">Add message</button>
    <button @click="clearMessages">Clear messages</button>
  </div>
</template>

<style>
#messages {
    display: flex;
    flex-direction: column;
    max-height: 400px;
    min-height: 400px;
    overflow: hidden;
    align-items: end;
}
.flex-row {
    display: flex;
    flex-direction: row;
    gap: 16px;
}
</style>