<script setup lang="ts">
import type {ClubFlagConfiguration, ISingleRunner, IStartListRunner} from "@/types/api";
import {useNow} from "@vueuse/core";
import {computed} from "vue";

import duration from 'format-duration-time';
import ClubFlag from "@/components/ClubFlag.vue";

const props = defineProps<{
  data: IStartListRunner[]
  conf: ClubFlagConfiguration
}>()


const now = useNow()
const nowTs = computed(() => now.value.getTime() / 1000)

const inRange = (from_: number, to: number, what: number): boolean => {
  return what >= from_ && what <= to
}

const timeDiffLabel = (startTime: number): string => {
  const diff = nowTs.value - startTime;
  return (diff < 0 ? "-" : "") + duration(Math.abs(diff), 's').format('mm:ss');
}

const onTrack = computed((): IStartListRunner[] => {
  return props.data.filter(r => nowTs.value > (r.start_time_ts??0))
})
const startWarning = computed((): IStartListRunner[] => {
  return props.data.filter(r => inRange(nowTs.value, nowTs.value+120, r.start_time_ts??0))
})
const beforeStart = computed((): IStartListRunner[] => {
  return props.data.filter(r => inRange(nowTs.value+120, Infinity, r.start_time_ts??0))
})
</script>

<template>
<div>
  <div
      class="relative border-b-4 border-b-gray-200"
      v-if="onTrack.length"
  >
      <div v-for="r in onTrack" class="Admin__StartAlert__row">
        <span v-text="r.bib_number" class="font-bold text-4xl text-co-orange tabular-nums"/>
        <span class="text-3xl font-semibold mr-auto flex flex-row items-center gap-4">

          <ClubFlag :conf="props.conf" :item="r" />
          {{ r.name }}
        </span>
        <span v-text="timeDiffLabel(r.start_time_ts??0)" class="text-lg tabular-nums"></span>
      </div>
      <div class="
        absolute top-0 bottom-0 right-full text-to-bottom text-center
        text-blue-400 text-2xl font-semibold uppercase p-2 overflow-hidden text-nowrap
      ">on track</div>
    </div>
  <div
      class=""
      v-if="startWarning.length"
  >
      <div v-for="r in startWarning"
           class="Admin__StartAlert__row bg-red-200 animate-pulse relative">
        <span v-text="r.bib_number" class="font-bold text-4xl text-co-orange tabular-nums"/>
        <span class="text-3xl font-semibold mr-auto flex flex-row items-center gap-4">

          <ClubFlag :conf="props.conf" :item="r" />
          {{ r.name }}
        </span>
        <span v-text="timeDiffLabel(r.start_time_ts??0)" class="text-lg tabular-nums"></span>

        <div class="
          absolute  right-full rounded-full animate-pulse size-6 bg-red-200 mx-4
        "></div>
      </div>
  </div>

  <div
      v-for="r in beforeStart"
      class="Admin__StartAlert__row text-gray-300"
  >
    <span v-text="r.bib_number" class="font-bold text-4xl text-co-orange tabular-nums"/>
    <span class="text-3xl font-semibold mr-auto flex flex-row items-center gap-4">
      <ClubFlag :conf="props.conf" :item="r" />
      {{ r.name }}

    </span>
    <span v-text="timeDiffLabel(r.start_time_ts??0)" class="text-lg tabular-nums"></span>
  </div>

</div>
</template>

<style scoped lang="postcss">

</style>