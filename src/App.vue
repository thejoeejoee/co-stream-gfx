<script setup lang="ts">
import {useEventSource} from '@vueuse/core'
import SplitTable from "@/components/SplitTable.vue";
import Time from "@/components/Time.vue";
import Text from "@/components/Text.vue";
import ResultsTable from "@/components/ResultsTable.vue";

import {onKeyStroke} from '@vueuse/core'
import {ref} from "vue";

const {status, data, error, close, eventSource} = useEventSource('http://localhost:8080/_sse')

eventSource.value?.addEventListener("message", (event) => {
  console.log("Message received:", event.data);
})

// check url param ?debug
const isDebug = new URLSearchParams(window.location.search).has('debug')

class Flags {
  time: boolean = false
  speaker: boolean = false
  results: boolean = false
  split: boolean = false
}

let flags = ref(new Flags())

onKeyStroke('1', (e) => {
  flags.value.time = !flags.value.time
})
onKeyStroke('2', (e) => {
  flags.value.speaker = !flags.value.speaker
})
onKeyStroke('3', (e) => {
  flags.value.split = !flags.value.split
})
onKeyStroke('4', (e) => {
  flags.value.results = !flags.value.results
})
</script>

<template>
  <main class="GfxScreen" :class="{ 'GfxScreen--debug': isDebug }">
    <Transition name="slide">
      <SplitTable class="absolute left-[96px] bottom-[96px]" v-show="flags.split"/>
    </Transition>
    <Transition name="slide">
      <Time class="absolute right-[96px] bottom-[96px]" v-show="flags.time"/>
    </Transition>
    <Transition name="slide">
      <ResultsTable class="absolute top-48 left-64 right-64" v-show="flags.results"/>
    </Transition>

    <Transition name="slide">
      <Text
          v-show="flags.speaker"
          class="absolute left-[96px] bottom-[96px]"
          text="Dan Wolf, David Procházka"
      />
    </Transition>
  </main>

  <div
    v-if="isDebug"
    class="
      flex flex-row gap-x-4 justify-center pt-8
      [&_button]:p-2
      [&_button]:bg-amber-100
      [&_button]:border-amber-400
      [&_button]:border
      [&_button]:uppercase
      [&_button]:font-semibold
      [&_button]:cursor-pointer
  ">
    <button @click="flags.time = !flags.time">time</button>
    <button @click="flags.speaker = !flags.speaker">speaker</button>
    <button @click="flags.split = !flags.split">split</button>
    <button @click="flags.results = !flags.results">results</button>
  </div>

</template>

<style scoped lang="postcss">
.GfxScreen {
  width: 1920px;
  height: 1080px;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
}

.GfxScreen--debug {
  //margin: 128px auto;
  background-image: repeating-conic-gradient(#cccccc44 0 25%, #0000 0 50%);
  background-position: bottom center;
  background-size: 96px 96px;
}
</style>
