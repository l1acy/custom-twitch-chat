<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
function goBack() {
    router.push({ path: '/', replace: false })
}
</script>

<template>
    <p>oww! page not found</p>
    <button @click="goBack">go back</button>
</template>

<style>
p {
    color: #fff;
}
</style>