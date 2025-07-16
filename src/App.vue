<script setup lang="ts">
import {useEventSource, useLocalStorage} from '@vueuse/core'
import Debug from "@/components/Debug.vue";
import Director from "@/components/director/Director.vue";
import GfxMain from "@/components/gfx/Main.vue";


const params = new URLSearchParams(window.location.search)
const {
  eventSource
} = useEventSource(params.get("sse") || 'http://localhost:8080/_sse/default')


</script>

<template>
  <GfxMain v-if="eventSource" :event-source="eventSource" :params="params"></GfxMain>
<!--  <Debug v-if="eventSource" :event-source="eventSource"/>-->
<!--  <Director></Director>-->
</template>

<style scoped lang="postcss">

</style>
