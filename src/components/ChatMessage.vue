<script setup>
import { onMounted, ref } from "vue";
import DOMPurify from 'dompurify'
import badgesList from '../assets/badges.json'

const props = defineProps({
  time: String,
  badges: Array,
  username: String,
  text: String,
  userColor: String,
  emotes: String,
});

const isVisible = ref(true);
const sanitizedText = ref('')
const $element = ref()

function formatText() {
  if (!props.emotes) return props.text;

  const emoteData = props.emotes.split("/").map((emote) => {
    let emoteList = [];
    const emoteSplit = emote.split(":");

    const src = emoteSplit[0];
    const placesString = emoteSplit[1];

    const places = placesString.split(",").map((place) => {
      const placeSplit = place.split("-").map(Number);
      emoteList.push({
        src: src,
        start: placeSplit[0],
        end: placeSplit[1],
      });
    });

    return emoteList;
  });
  const unpackRecurciveLists = (arr) =>
    arr.reduce(
      (acc, val) =>
        acc.concat(Array.isArray(val) ? unpackRecurciveLists(val) : val),
      []
    );

  let emotes = unpackRecurciveLists(emoteData);
  emotes.sort((a, b) => a.start - b.start);
  emotes.reverse();

  console.log(emotes);

  let formattedMessage = props.text;
  let emoteIteration = 0;
  emotes.forEach(({ src, start, end }) => {
    formattedMessage =
      formattedMessage.slice(0, start) +
      `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${src}/default/dark/1.0" class="smile" style="animation-delay: 0.${emoteIteration}s">` +
      formattedMessage.slice(end + 1);

    emoteIteration += 1;
  });

  return formattedMessage;
}

function sanitizeText(text) {
  const allowedTags = ["img"]; // Добавляем 'img' в список разрешенных тегов
  const allowedAttributes = {
    img: ["src"], // Добавляем 'src' в список разрешенных атрибутов для тегов img
  };

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ["src", "class", "style"],
  });
}

onMounted(() => {
  sanitizedText.value = sanitizeText(formatText())

  setTimeout(
    () => {
      isVisible.value = false
    },
    15 * 1000
  )
  setTimeout(
    () => {
      $this.classList.add('messageOut')
    },
    15 * 1000 - 250
  )
});
</script>

<template>
  <div class="chatMessage" v-if="isVisible" ref="$this">
    <span>
      <span class="messageTime">{{ time }}</span>
      <span class="userBadges">
        <img
          v-for="badge in badges"
          class="badge"
          :src="badgesList[badge]"
          alt=""
        />
      </span>
      <span class="messageUsername" :style="'color: ' + userColor">{{
        username
      }}</span
      ><span class="spliter">: </span>
      <span class="messageText" v-html="sanitizedText"></span>
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
  padding-top: 12px;
}
.messageOut {
  animation: messageOut 0.25s forwards cubic-bezier(0.57, 0.03, 0, 1);
}
.messageUsername {
  font-size: 26px;
  font-weight: 700;
}
.spliter {
  margin-left: 2px;
  font-size: 24px;
}
.messageText {
  font-size: 26px;
  font-weight: 400;

  width: 100%;
  overflow-x: hidden;

  overflow-wrap: break-word;
  word-break: break-word;
  color: #EFEFF1;
}
.messageTime {
  font-size: 26px;
  font-weight: 400;
  color: #adadb8;
  margin-right: 10px;
}
.badge {
  padding-right: 8px;
  width: 34px;
  position: relative;
  top: 8px;
  max-height: 34px;
}
.smile {
  transform: scale(0%);
  width: 34px;
  position: relative;
  top: 8px;

  animation: smile 0.3s forwards cubic-bezier(0.16, 0.24, 0, 1);
}
</style>
