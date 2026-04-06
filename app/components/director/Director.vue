<script setup lang="ts">
import { invoke, until, useFetch, type UseFetchReturn, useNow } from '@vueuse/core'
import { computed, ref } from 'vue'
import DirectorStartAlert from './DirectorStartAlert.vue'
import type { IStartListRunner } from '~/types/api.d'
import { alertOffset, params, timeOffset } from '~/state'

const now = useNow({})
const nowTs = computed(() => (now.value.getTime() / 1000) - timeOffset)

interface IDirectorFavorite {
  is_national: boolean
  is_relay: boolean

  data: IDirectorFavoriteClass[]
}

interface IDirectorFavoriteClass {
  class: string
  data: IStartListRunner[]
}

const sseUrl = new URL(params.get('sse') || 'http://localhost:8080/_sse/default')
const { data }: UseFetchReturn<IDirectorFavorite> = useFetch(`${sseUrl.origin}/api/director-favorite`).get().json()

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const alertsEnabled = ref(false)

const enableAlerts = () => {
  const audioCtx = new AudioContext()
  const gain = audioCtx.createGain()

  alertsEnabled.value = !alertsEnabled.value

  data.value?.data.forEach((col) => {
    col.data.forEach((r) => {
      invoke(async () => {
        let st = (r.start_time_ts ?? 0) + 3*3600;
        if (st < nowTs.value) {
          // already started
          return
        }

        const oscillator = audioCtx.createOscillator()

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(380, audioCtx.currentTime) // value in hertz

        oscillator.start(audioCtx.currentTime)

        await until(nowTs).toMatch(n => (st - n) < alertOffset)

        for (let i = 0; i < 3; i++) {
          oscillator.connect(audioCtx.destination)
          await sleep(200)
          oscillator.disconnect()
          await sleep(800)
        }

        oscillator.connect(audioCtx.destination)
        await sleep(800)
        oscillator.disconnect()
      })
    })
  })
}
</script>

<template>
  <div class="h-screen">
    <div class="flex flex-row items-top justify-between">
      <div class="flex flex-col h-screen items-center justify-between bg-amber-200">
        <div class="p-4 font-black uppercase text-to-bottom text-4xl text-center">
          DIRECTOR ALERTS
        </div>
        <button
          class="text-xl p-4"
          :class="{ 'bg-green-500': alertsEnabled, 'bg-gray-300': !alertsEnabled }"
          @click="enableAlerts"
          v-text="alertsEnabled ? '🔊' : '🔇'"
        />
      </div>
      <div
        v-for="(col, i) in data?.data"
        class="mx-auto"
      >
        <h2
          class="text-6xl text-center p-4"
          v-text="col.class"
        />

        <DirectorStartAlert
          :ref="`director-start-alert-${i}`"
          :data="col.data"
          :conf="data ?? { is_national: false, is_relay: false }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.text-to-bottom {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
</style>
