<script setup lang="ts">
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
import { useGfxState } from '~/composables/useGfxState'
import { useSSEEvent } from '~/composables/useSSEEvent'
import {
  FreeTextSchema,
  ParametersSchema,
  LiveFeedSchema,
  RaceTitleSchema,
  SpeakerSchema,
  WeatherSchema,
  StartListSchema,
  SingleRunnerSchema,
  StartDetailSchema,
  ResultsSchema,
  FlowersSchema
} from '~/types/schemas'

const { state, hideAll } = useGfxState()

// Hide event
watch(
  () => eventSource.value,
  (source) => {
    if (source) {
      source.addEventListener('hide', () => {
        hideAll()
      })
    }
  },
  { immediate: true }
)

// Type-safe SSE event handlers with validation
useSSEEvent(eventSource, 'freetext', FreeTextSchema, (data) => {
  state.value.freetext = data
})

useSSEEvent(eventSource, 'params', ParametersSchema, (data) => {
  state.value.parameters = data
})

useSSEEvent(eventSource, 'live-feed', LiveFeedSchema, (data) => {
  state.value.liveFeed = data
})

useSSEEvent(eventSource, 'title', RaceTitleSchema, (data) => {
  state.value.title = data
})

useSSEEvent(eventSource, 'speaker', SpeakerSchema, (data) => {
  state.value.speaker = data
})

useSSEEvent(eventSource, 'weather', WeatherSchema, (data) => {
  state.value.weather = data
})

useSSEEvent(eventSource, 'startlist', StartListSchema, (data) => {
  state.value.startlist = data
})

useSSEEvent(eventSource, 'single-runner', SingleRunnerSchema, (data) => {
  state.value.start = null
  state.value.singleRunner = data
})

useSSEEvent(eventSource, 'start', StartDetailSchema, (data) => {
  state.value.singleRunner = null
  state.value.start = data
})

useSSEEvent(eventSource, 'results', ResultsSchema, (data) => {
  state.value.results = data
})

useSSEEvent(eventSource, 'flowers', FlowersSchema, (data) => {
  state.value.flowers = data
})
</script>

<template>
  <div class="GfxScreen select-none backface-hidden">
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
        class="absolute left-24 bottom-24 rounded-[var(--border-radius)] overflow-hidden"
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
        class="absolute left-24 bottom-24 rounded-[var(--border-radius)] overflow-hidden"
      >
        <Start :start="state.start" />
      </div>
    </Transition>

    <Transition name="slide">
      <Text
        v-if="state.speaker !== null"
        class="absolute left-24 bottom-24 rounded-[var(--border-radius)] overflow-hidden"
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
