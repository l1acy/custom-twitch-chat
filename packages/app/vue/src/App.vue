<script setup>
import { applyStyles } from './lib/styles';
import { onMounted } from 'vue';

import { RouterView } from 'vue-router';

import getItem from './lib/storage';
import { changeChatPosition } from './lib/styles';

onMounted(() => {
  const styleElement = document.createElement("style");
  styleElement.id = "dynamic-style";
  document.head.appendChild(styleElement);
  applyStyles()

  const chatPosition = getItem('chatPosition', 'right')
  changeChatPosition(chatPosition)
});

</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
