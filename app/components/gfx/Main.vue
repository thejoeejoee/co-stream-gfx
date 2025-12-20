<script setup lang="ts">
import type {
  IFlowers,
  IFreeText,
  ILiveFeed,
  IParameters, IRaceTitle,
  IResults,
  ISingleRunner,
  ISpeaker,
  IStartDetail,
  IStartList, IWeather
} from '~/types/api.d'
import { useLocalStorage } from '@vueuse/core'
import Weather from './Weather.vue'
import SingleRunner from './SingleRunner.vue'
import Parameters from './Parameters.vue'
import Start from './Start.vue'
import _TimeText from './Time.vue'
import RaceTitle from './RaceTitle.vue'
import StartList from './StartList.vue'
import Text from './Text.vue'
import { IconSpeakerphone } from '@tabler/icons-vue'
import Flowers from './Flowers.vue'
import LiveFeed from './LiveFeed.vue'
import ResultsTable from './ResultsTable.vue'

import { eventSource } from '~/state'

class State {
  freetext: IFreeText | null = null
  liveFeed: ILiveFeed | null = null
  parameters: IParameters | null = null
  results: IResults | null = null
  singleRunner: ISingleRunner | null = null
  speaker: ISpeaker | null = null
  start: IStartDetail | null = null
  startlist: IStartList | null = null
  title: IRaceTitle | null = null
  weather: IWeather | null = null
  flowers: IFlowers | null = null
}

const state = useLocalStorage('state-v1', new State())

eventSource.value?.addEventListener('hide', (event: any) => {
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
  state.value.flowers = null
})
// TODO: generalize?
eventSource.value?.addEventListener('freetext', (event) => {
  state.value.freetext = JSON.parse(event.data) as IFreeText
})
eventSource.value?.addEventListener('params', (event) => {
  state.value.parameters = JSON.parse(event.data) as IParameters
})
eventSource.value?.addEventListener('live-feed', (event) => {
  state.value.liveFeed = JSON.parse(event.data) as ILiveFeed
})
eventSource.value?.addEventListener('title', (event) => {
  state.value.title = JSON.parse(event.data) as IRaceTitle
})
eventSource.value?.addEventListener('speaker', (event) => {
  state.value.speaker = JSON.parse(event.data) as ISpeaker
})
eventSource.value?.addEventListener('weather', (event) => {
  state.value.weather = JSON.parse(event.data) as IWeather
})
eventSource.value?.addEventListener('startlist', (event) => {
  state.value.startlist = JSON.parse(event.data) as IStartList
})
eventSource.value?.addEventListener('single-runner', (event) => {
  state.value.start = null
  state.value.singleRunner = JSON.parse(event.data) as ISingleRunner
})
eventSource.value?.addEventListener('start', (event) => {
  state.value.singleRunner = null
  state.value.start = JSON.parse(event.data) as IStartDetail
})
eventSource.value?.addEventListener('results', (event) => {
  state.value.results = JSON.parse(event.data) as IResults
})
eventSource.value?.addEventListener('flowers', (event) => {
  state.value.flowers = JSON.parse(event.data) as IFlowers
})
</script>

<template>
  <div class="GfxScreen select-none backface-hidden">
    <!--    <PositionHistory -->
    <!--      class="absolute inset-64" -->
    <!--    /> -->
    <Transition
      name="nested-slide"
      :duration="500"
    >
      <LiveFeed
        v-if="state.liveFeed !== null"
        class="absolute left-24 bottom-24"
        :data="state.liveFeed"
      />
    </Transition>
    <!--    <Transition name="slide"> -->
    <!--      <div class="absolute right-24 bottom-24 flex flex-row" v-if="false"> -->
    <!--        <TimeText prefix="M18"/> -->
    <!--        <TimeText prefix="W18" :offset="300"/> -->
    <!--      </div> -->
    <!--    </Transition> -->
    <Transition
      name="nested-slide"
      :duration="500"
    >
      <ResultsTable
        v-if="state.results !== null"
        :data="state.results"
        class="absolute top-36 left-120 right-120"
      />
    </Transition>
    <Transition
      name="nested-slide"
      :duration="500"
    >
      <StartList
        v-if="state.startlist !== null"
        :data="state.startlist"
        class="absolute top-36 left-120 right-120"
      />
    </Transition>
    <Transition
      name="nested-slide"
      :duration="500"
    >
      <RaceTitle
        v-if="state.title !== null"
        :data="state.title"
        class="absolute bottom-24 left-80 right-80"
      />
    </Transition>
    <Transition
      name="nested-slide"
      :duration="500"
    >
      <Weather
        v-if="state.weather !== null"
        :data="state.weather"
        class="absolute right-24 bottom-24"
      />
    </Transition>
    <Transition
      name="nested-slide"
      :duration="500"
    >
      <Parameters
        v-if="state.parameters !== null"
        class="absolute right-24 bottom-24"
        :data="state.parameters"
      />
    </Transition>

    <Transition name="slide">
      <Flowers
        v-if="state.flowers !== null"
        class="absolute bottom-36 left-64 right-64"
        :data="state.flowers"
      />
    </Transition>

    <Transition name="slide">
      <Text
        v-if="state.freetext !== null"
        class="absolute left-24 bottom-24 rounded-md overflow-hidden"
      >
        {{ state.freetext.text }}
      </Text>
    </Transition>

    <Transition
      name="nested-slide"
      :duration="500"
      mode="out-in"
    >
      <div
        v-if="state.singleRunner !== null"
        :key="state.singleRunner.name"
        class="absolute left-24 bottom-24"
      >
        <SingleRunner :single-runner="state.singleRunner" />
      </div>
    </Transition>

    <Transition
      name="nested-slide"
      :duration="500"
      mode="out-in"
    >
      <div
        v-if="state.start !== null"
        :key="state.start.name"
        class="absolute left-24 bottom-24 rounded-md overflow-hidden"
      >
        <Start :start="state.start" />
      </div>
    </Transition>

    <Transition name="slide">
      <Text
        v-if="state.speaker !== null"
        class="absolute left-24 bottom-24 rounded-md overflow-hidden"
      >
        {{ state.speaker.commentators }}
        <template #icon>
          <IconSpeakerphone
            size="64"
            stroke="2"
          />
        </template>
      </Text>
    </Transition>
  </div>
</template>

<style lang="postcss" scoped>
.GfxScreen {
  width: 1920px;
  height: 1080px;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
}

.GfxScreen--debug {

  background-image: repeating-conic-gradient(#cccccc44 0 25%, #0000 0 50%);

  background-position: bottom center;
  background-size: 96px 96px;
}
</style>
