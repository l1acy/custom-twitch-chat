<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import ChatView from "../components/ChatView.vue";

const $route = useRoute()
const channelName = String($route.params.channel)

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
  <div>
    <ChatView :channel="channelName"/>
  </div>
</template>

<style scoped></style>
