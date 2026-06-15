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
  IStartGroup,
  IStartList, ITimer, IWeather
} from '~/types/api.d'
import { useLocalStorage } from '@vueuse/core'
import { watchEffect } from 'vue'
import Weather from './Weather.vue'
import SingleRunner from './SingleRunner.vue'
import Parameters from './Parameters.vue'
import Start from './Start.vue'
import StartGroup from './StartGroup.vue'
import RaceTitle from './RaceTitle.vue'
import StartList from './StartList.vue'
import Text from './Text.vue'
import Time from './Time.vue'
import { IconSpeakerphone } from '@tabler/icons-vue'
import Flowers from './Flowers.vue'
import LiveFeed from './LiveFeed.vue'
import ResultsTable from './ResultsTable.vue'

import { eventSource } from '~/state'
import { useTheme } from '~/composables/useTheme'
import { type GfxState, createDefaultState, eventMap, exclusions, hideEvents } from '~/utils/gfx-state'

const state = useLocalStorage<GfxState>('state-v1', createDefaultState())

useTheme()

const stateKeys = Object.keys(state.value) as (keyof GfxState)[]

const hideAll = () => {
  for (const key of stateKeys) {
    if (key === 'timer') continue
    state.value[key] = null
  }
}

watchEffect((onCleanup) => {
  const es = eventSource.value
  if (!es) return

  const controller = new AbortController()

  es.addEventListener('hide', () => hideAll(), { signal: controller.signal })

  for (const [eventName, stateKey] of Object.entries(hideEvents)) {
    es.addEventListener(eventName, () => {
      state.value[stateKey] = null
    }, { signal: controller.signal })
  }

  for (const [eventName, stateKey] of Object.entries(eventMap)) {
    es.addEventListener(eventName, (event: MessageEvent) => {
      try {
        const excluded = exclusions[stateKey]
        if (excluded) {
          const hadVisible = excluded.some(key => state.value[key] !== null)
          for (const key of excluded) {
            state.value[key] = null
          }
          if (hadVisible) {
            setTimeout(() => {
              state.value[stateKey] = JSON.parse(event.data)
            }, 500)
            return
          }
        }
        state.value[stateKey] = JSON.parse(event.data)
      } catch (err) {
        console.error(`Failed to parse SSE event "${eventName}":`, err)
      }
    }, { signal: controller.signal })
  }

  onCleanup(() => controller.abort())
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
    <Transition name="slide">
      <Time
        v-if="state.timer"
        class="absolute right-24 top-24"
        :data="state.timer"
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
         class="absolute left-24 bottom-24 rounded-[var(--gfx-radius)] overflow-hidden"
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
         class="absolute left-24 bottom-24 rounded-[var(--gfx-radius)] overflow-hidden"
       >
         <Start :start="state.start" />
       </div>
     </Transition>

     <Transition
       name="nested-slide"
       :duration="500"
     >
       <StartGroup
         v-if="state.startGroup?.start_time"
         :data="state.startGroup"
         class="absolute left-24 bottom-24"
       />
     </Transition>

     <Transition name="slide">
       <Text
         v-if="state.speaker !== null"
         class="absolute left-24 bottom-24 rounded-[var(--gfx-radius)] overflow-hidden"
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
