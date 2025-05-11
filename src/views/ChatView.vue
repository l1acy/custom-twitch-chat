<script setup lang="ts">
import { useRoute } from "vue-router";
import ChatView from "../components/ChatView.vue";

const $route = useRoute()
const channelName = String($route.params.channel)
</script>

<template>
  <div>
    <ChatView :channel="channelName"/>
  </div>
</template>

<style scoped></style>
