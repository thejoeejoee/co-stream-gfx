<template>

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
    <button @click="flags.parameters = !flags.parameters">parameters</button>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {onKeyStroke} from "@vueuse/core";

const params = new URLSearchParams(window.location.search)
const isDebug = params.has('debug')

// TODO: move all flags to some debug component triggering the events
class Flags {
  time: boolean = params.has("time") || false
  speaker: boolean = params.has("speaker") || false
  results: boolean = params.has("results") || false
  split: boolean = params.has("split") || false
  raceTitle: boolean = params.has("raceTitle") || false
  weather: boolean = params.has("weather") || false
  parameters: boolean = params.has("parameters") || false
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
onKeyStroke('7', (e) => {
  flags.value.parameters = !flags.value.parameters
})

// TODO: receive event stream and send demo data

</script>