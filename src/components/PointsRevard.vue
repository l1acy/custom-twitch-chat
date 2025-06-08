<script setup>
defineProps({
  username: String,
  rewardName: String,
  rewardPrice: Number,
  pointsIconUrl: String,
  pointsName: String,
});
</script>

<template>
  <div class="chatMessage" ref="$element">
    <span class="text">
      {{ username }} получает награду:
      <span class="rewardName">{{ rewardName }}</span>
      стоимостью
      <span class="rewardPrice"
        > <img :src="pointsIconUrl" :alt="pointsName" /> {{ rewardPrice }}</span
      >
    </span>
  </div>
</template>

<style>
@keyframes messageIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
@keyframes messageOut {
  0% {
    opacity: 1;
    transform: translateY(0px);
  }
  99% {
    opacity: 0;
    transform: translateY(0px);
  }
  100% {
    opacity: 0;
    display: none;
    transform: translateY(0px);
  }
}
@keyframes message {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  10% {
    opacity: 1;
    transform: translateY(0px);
  }
  90% {
    opacity: 1;
    transform: translateY(0px);
  }
  99% {
    opacity: 0;
    transform: translateY(0px);
  }
  100% {
    display: none;
    opacity: 0;
    transform: translateY(0px);
  }
}
@keyframes smile {
  0% {
    transform: scale(0%);
  }
  100% {
    transform: scale(100%);
  }
}
.chatMessage {
  transform: translateY(10px);
  animation: messageIn 0.3s forwards cubic-bezier(0.16, 0.24, 0, 1);
  position: relative;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px 24px;
}
.messageOut {
  animation: messageOut 0.25s forwards cubic-bezier(0.57, 0.03, 0, 1);
}
.text {
  font-size: 26px;
  color: #d3d3d3;
}
.rewardName {
  font-weight: 500;
  color: #ffffff;
}
.rewardPrice {
    color: #ffffff;
}
.rewardPrice > img {
    position: relative;
    top: 3px;
}
</style>
