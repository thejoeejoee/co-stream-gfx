<script setup lang="ts">
import {useEventSource} from '@vueuse/core'
import SplitTable from "@/components/SplitTable.vue";
import Time from "@/components/Time.vue";
import Text from "@/components/Text.vue";
import ResultsTable from "@/components/ResultsTable.vue";
import RaceTitle from "@/components/RaceTitle.vue";
import Weather from "@/components/Weather.vue";
import {IconSpeakerphone} from "@tabler/icons-vue";

import {onKeyStroke} from '@vueuse/core'
import {ref} from "vue";

const {status, data, error, close, eventSource} = useEventSource('http://localhost:8080/_sse')

eventSource.value?.addEventListener("message", (event) => {
  console.log("Message received:", event.data);
})

const params = new URLSearchParams(window.location.search)
// check url param ?debug
const isDebug = params.has('debug')
const showAll = params.has('all')

class Flags {
  time: boolean = params.has("time") || showAll || false
  speaker: boolean = params.has("speaker") || showAll || false
  results: boolean = params.has("results") || showAll || false
  split: boolean = params.has("split") || showAll || false
  raceTitle: boolean = params.has("raceTitle") || showAll || false
  weather: boolean = params.has("weather") || showAll || false
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
onKeyStroke('5', (e) => {
  flags.value.raceTitle = !flags.value.raceTitle
})
onKeyStroke('6', (e) => {
  flags.value.weather = !flags.value.weather
})
</script>

<template>
  <main class="GfxScreen" :class="{ 'GfxScreen--debug': isDebug }">
    <Transition name="slide">
      <SplitTable class="absolute left-24 bottom-24" v-show="flags.split"/>
    </Transition>
    <Transition name="slide">
      <Time class="absolute right-24 bottom-24" v-show="flags.time"/>
    </Transition>
    <Transition name="slide">
      <ResultsTable class="absolute top-48 left-64 right-64" v-show="flags.results"/>
    </Transition>
    <Transition name="slide">
      <RaceTitle class="absolute bottom-24 left-64 right-64" v-show="flags.raceTitle"/>
    </Transition>
    <Transition name="slide">
      <Weather class="absolute right-24 bottom-24" v-show="flags.weather"/>
    </Transition>

    <Transition name="slide">
      <Text
          v-show="flags.speaker"
          class="absolute left-24 bottom-24"
          text="Dan Wolf, David Procházka"
      >
        <template #icon>
          <IconSpeakerphone size="64" stroke="2"/>
        </template>
      </Text>
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
    <button @click="flags.raceTitle = !flags.raceTitle">race title</button>
    <button @click="flags.weather = !flags.weather">weather</button>
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
