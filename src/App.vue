<script setup lang="ts">
import {useEventSource, useLocalStorage} from '@vueuse/core'
import LiveFeed from "@/components/LiveFeed.vue";
import Text from "@/components/Text.vue";
import ResultsTable from "@/components/ResultsTable.vue";
import StartList from "@/components/StartList.vue";
import RaceTitle from "@/components/RaceTitle.vue";
import Parameters from "@/components/Parameters.vue";
import Weather from "@/components/Weather.vue";
import Flag from "@/components/Flag.vue";
import Debug from "@/components/Debug.vue";
import {IconSpeakerphone} from "@tabler/icons-vue";
import type {
  IFreeText,
  ILiveFeed,
  IParameters,
  IRaceTitle,
  IResults,
  ISingleRunner,
  ISpeaker,
  IStartDetail,
  IStartList,
  IWeather
} from "@/types/api";

const params = new URLSearchParams(window.location.search)

class State {
  freetext: IFreeText | null = null
  liveFeed: ILiveFeed | null = null
  parameters: IParameters | null = null
  results: IResults | null = null;
  singleRunner: ISingleRunner | null = null;
  speaker: ISpeaker | null = null;
  start: IStartDetail | null = null;
  startlist: IStartList | null = null;
  title: IRaceTitle | null = null;
  weather: IWeather | null = null;
}

let state = useLocalStorage("state-v1", new State())

// TODO: reconnect needed
const {
  status,
  data,
  error,
  close,
  eventSource
} = useEventSource(params.get("sse") || 'http://localhost:8080/_sse/default')

eventSource.value?.addEventListener("hide", (event) => {
  state.value.freetext = null
  state.value.parameters = null
  state.value.liveFeed = null
  state.value.title = null
  state.value.speaker = null
  state.value.weather = null
  state.value.startlist = null
  state.value.singleRunner = null
  state.value.start = null
  state.value.results = null
})
// TODO: generalize?
eventSource.value?.addEventListener("freetext", (event) => {
  state.value.freetext = JSON.parse(event.data) as IFreeText
})
eventSource.value?.addEventListener("params", (event) => {
  state.value.parameters = JSON.parse(event.data) as IParameters
})
eventSource.value?.addEventListener("live-feed", (event) => {
  state.value.liveFeed = JSON.parse(event.data) as ILiveFeed
})
eventSource.value?.addEventListener("title", (event) => {
  state.value.title = JSON.parse(event.data) as IRaceTitle
})
eventSource.value?.addEventListener("speaker", (event) => {
  state.value.speaker = JSON.parse(event.data) as ISpeaker
})
eventSource.value?.addEventListener("weather", (event) => {
  state.value.weather = JSON.parse(event.data) as IWeather
})
eventSource.value?.addEventListener("startlist", (event) => {
  state.value.startlist = JSON.parse(event.data) as IStartList
})
eventSource.value?.addEventListener("single-runner", (event) => {
  state.value.singleRunner = JSON.parse(event.data) as ISingleRunner
})
eventSource.value?.addEventListener("start", (event) => {
  state.value.start = JSON.parse(event.data) as IStartDetail
})
eventSource.value?.addEventListener("results", (event) => {
  state.value.results = JSON.parse(event.data) as IResults
})

// check url param ?debug
const isDebug = params.has('debug')
</script>

<template>
  <main class="GfxScreen select-none" :class="{ 'GfxScreen--debug': isDebug }">
    <Transition name="slide">
      <LiveFeed
          v-if="state.liveFeed !== null"
          class="absolute left-24 bottom-24"
          :data="state.liveFeed"
      />
    </Transition>
    <Transition name="slide">
      <!--      <Time class="absolute right-24 bottom-24" v-show="flags.time"/>-->
    </Transition>
    <Transition name="slide">
      <ResultsTable
          v-if="state.results !== null"
          :data="state.results"
          class="absolute top-36 left-96 right-96"
      />
    </Transition>
    <Transition name="slide">
      <StartList
          v-if="state.startlist !== null"
          :data="state.startlist"
          class="absolute top-36 left-96 right-96"
      />
    </Transition>
    <Transition name="slide">
      <RaceTitle
          v-if="state.title !== null"
          :data="state.title"
          class="absolute bottom-24 left-64 right-64"
      />
    </Transition>
    <Transition name="slide">
      <Weather
          v-if="state.weather !== null"
          :data="state.weather"
          class="absolute right-24 bottom-24"
      />
    </Transition>
    <Transition name="slide">
      <Parameters
          class="absolute right-24 bottom-24"
          v-if="state.parameters !== null"
          :data="state.parameters"
      />
    </Transition>

    <Transition name="slide">
      <Text
          v-if="state.freetext !== null"
          class="absolute left-24 bottom-24"
      >
        {{ state.freetext.text }}
      </Text>
    </Transition>

    <Transition name="slide">
      <div class="
        absolute left-24 bottom-24
        h-36 flex-col
        border-l-[calc(var(--spacing)*2)] border-l-co-orange
      " v-if="state.singleRunner !== null">
        <div class="
          flex flex-row items-center justify-between
          text-lg bg-white
        ">
          <span
              v-if="state.singleRunner.bib_number || 10"
              class="
              flex items-center px-6
              bg-co-orange  text-co-beige
              h-24 font-semibold
            "
              v-text="state.singleRunner.bib_number || 10"
          />
          <h1
              class="
                h-24 bg-white px-6 gap-x-4
                flex flex-row justify-between items-center
                font-co uppercase text-co-black
          ">
            {{ state.singleRunner.name }}
            <Flag :country="state.singleRunner.nationality" class="px-4"/>
          </h1>
        </div>

        <h2 class="
          font-co text-md h-12 flex items-center justify-between gap-x-4
          p-4
          bg-co-orange text-co-beige
        ">
          <span v-text="state.singleRunner.class" class="italic font-semibold"/>
          <span v-text="state.singleRunner.detail"></span>
        </h2>

      </div>
    </Transition>

    <Transition name="slide">
      <Text
          v-if="state.start !== null"
          class="absolute left-24 bottom-24"
      >
        <template v-slot:icon v-if="state.start.bib_number || 10">
          <span
              v-text="state.start.bib_number || 10"
              class="text-lg font-semibold"
          ></span>
        </template>

        <span v-text="state.start.name"></span>

        <template v-slot:right v-if="state.start.nationality">
          <Flag :country="state.start.nationality"/>
        </template>
        <template v-slot:right-gutter v-if="state.start.start_time">
          <span
              class="text-lg bg-co-orange text-co-beige p-6 font-semibold"
              v-text="state.start.start_time"
          ></span>
        </template>
      </Text>
    </Transition>

    <Transition name="slide">
      <Text
          v-if="state.speaker !== null"
          class="absolute left-24 bottom-24"
      >
        {{ state.speaker.commentators }}
        <template #icon>
          <IconSpeakerphone size="64" stroke="2"/>
        </template>
      </Text>
    </Transition>
  </main>

    <Debug v-if="eventSource" :event-source="eventSource"/>
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
