<script setup lang="ts">
import { useEventSource } from '@vueuse/core'
import SplitTable from "@/components/SplitTable.vue";
import Time from "@/components/Time.vue";

const { status, data, error, close, eventSource } = useEventSource('http://localhost:8080/_sse')

eventSource.value?.addEventListener("message", (event) => {
  console.log("Message received:", event.data);
})

// check url param ?debug
const isDebug = new URLSearchParams(window.location.search).has('debug')
</script>

<template>
  <main class="FxScreen" :class="{ 'FxScreen--debug': isDebug }">
    <SplitTable class="absolute left-[128px] bottom-[128px]"/>

    <Time class="absolute right-[128px] bottom-[128px]"/>

  </main>

</template>

<style scoped lang="postcss">
  .FxScreen {
    width: 1920px;
    height: 1080px;
    position: relative;
    margin: 0 auto;
  }
  .FxScreen--debug {
    //margin: 128px auto;
    background-image: repeating-conic-gradient(#cccccc88 0 25%, #0000 0 50%);
    background-position: center bottom;
    background-size: 96px 96px;
  }
</style>
