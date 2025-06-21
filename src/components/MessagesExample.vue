<script setup>
import { reactive } from 'vue';
import ChatMessage from './ChatMessage.vue';

const messages = reactive([])

function addMessage() {
    const randomMessages = [
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.',
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Adipiscing elit quisque faucibus ex sapien vitae pellentesque. Vitae pellentesque sem placerat in id cursus mi. Cursus mi pretium tellus duis convallis tempus leo. Tempus leo eu aenean sed diam urna tempor. Urna tempor pulvinar vivamus fringilla lacus nec metus.',
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.',
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.',
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.'
    ]
    const randomNicknames = [
        'zhuzha',
        'l1acy',
        'twitch',
        'nely',
        'wuuump',
        'crazyPumpkin'
    ]
    const randomColors = [
        'ff0000',
        '008000',
        'b22222',
        'ff7f50',
        '9acd32',
        'ff4500',
        '2e8b57',
        'daa520',
        'd2691e',
        '5f9ea0',
        '1e90ff',
        'ff69b4',
        '8a2be2',
        '00ff7f'
    ]
    messages.push(
        {
            username: randomNicknames[Math.floor(Math.random() * randomNicknames.length)],
            message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
            badges: [],
            time: '12:34',
            id: 'ao4',
            color: '#' + randomColors[Math.floor(Math.random() * randomColors.length)]
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
      :color="message.color"
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

<style scoped>
button {
    position: relative;
    z-index: 999;
}
</style>