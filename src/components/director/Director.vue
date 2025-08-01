<script setup lang="ts">
import {invoke, until, useFetch, type UseFetchReturn, useNow} from '@vueuse/core'
import {computed, ref, useTemplateRef} from "vue";
import DirectorStartAlrt from "@/components/director/DirectorStartAlert.vue";
import type {IStartList, IStartListRunner} from "@/types/api";
import {alertOffset, timeOffest} from "@/state.ts";

const now = useNow({})
const nowTs = computed(() => (now.value.getTime() / 1000) - timeOffest)

interface IDirectorFavorite {
  is_national: boolean
  is_relay: boolean

  data: IDirectorFavoriteClass[]
}

interface IDirectorFavoriteClass {
  class: string
  data: IStartListRunner[]
}

// const {data}: UseFetchReturn<IDirectorFavorite> = useFetch("http://127.0.0.1:5000/api/director-favorite").get().json()
const {data}: UseFetchReturn<IDirectorFavorite> = useFetch("http://192.168.42.88:5000/api/director-favorite").get().json()


async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const alertsEnabled = ref(false)

const enableAlerts = () => {
  const audioCtx = new AudioContext();
  const gain = audioCtx.createGain();



  alertsEnabled.value = !alertsEnabled.value;

  data.value?.data.forEach((col) => {
    col.data.forEach((r) => {
      invoke(async () => {
        if ((r.start_time_ts ?? 0) < nowTs.value) {
          // already started
          return;
        }

        const oscillator = audioCtx.createOscillator();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(380, audioCtx.currentTime); // value in hertz

        oscillator.start(audioCtx.currentTime);

        await until(nowTs).toMatch(n => ((r.start_time_ts ?? 0) - n) < alertOffset);

        for (let i = 0; i < 3; i++) {
          oscillator.connect(audioCtx.destination);
          await sleep(200)
          oscillator.disconnect();
          await sleep(800)
        }

        oscillator.connect(audioCtx.destination);
        await sleep(800)
        oscillator.disconnect();
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
            @click="enableAlerts"
            class="text-xl p-4"
            :class="{'bg-green-500': alertsEnabled, 'bg-gray-300': !alertsEnabled}"
            v-text="alertsEnabled ? '🔊' : '🔇'"
        >
        </button>
        </div>
      <div v-for="(col, i) in data?.data" class="mx-auto">
        <h2 v-text="col.class" class="text-6xl text-center p-4"></h2>

        <DirectorStartAlrt
            :data="col.data" :conf="data ?? {is_national: false, is_relay: false}"
            :ref="`director-start-alert-${i}`"
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