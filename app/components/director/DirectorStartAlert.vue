<script setup lang="ts">
import type { ClubFlagConfiguration, IStartListRunner } from '~/types/api.d'
import { useNow } from '@vueuse/core'
import { computed } from 'vue'

import duration from 'format-duration-time'
import ClubFlag from './../ClubFlag.vue'
import { alertOffset, timeOffset } from '~/state'
import { inRange } from '~/utils/range'

const props = defineProps<{
  data: IStartListRunner[]
  conf: ClubFlagConfiguration
}>()

const now = useNow()
const nowTs = computed(() => (now.value.getTime() / 1000) - timeOffset)

const timeDiffLabel = (startTime: number): string => {
  const diff = nowTs.value - startTime
  return (diff < 0 ? '-' : '') + duration(Math.abs(diff), 's').format('mm:ss')
}

const onTrack = computed((): IStartListRunner[] => {
  const all = props.data.filter(r => nowTs.value > (r.start_time_ts ?? 0))

  // last 4
  if (all.length > 4) {
    return all.slice(-4)
  }
  return all
})
const startWarning = computed((): IStartListRunner[] => {
  return props.data.filter(r => inRange(nowTs.value, nowTs.value + alertOffset, r.start_time_ts ?? 0))
})
const beforeStart = computed((): IStartListRunner[] => {
  return props.data.filter(r => inRange(nowTs.value + alertOffset, Infinity, r.start_time_ts ?? 0))
})
</script>

<template>
  <div>
    <div
      v-if="onTrack.length"
      class="relative border-b-4 border-b-gray-200"
    >
      <div
        v-for="r in onTrack"
        :key="r.bib_number"
        class="Admin__StartAlert__row"
      >
        <span
          class="font-bold text-4xl text-co-orange tabular-nums"
          v-text="r.bib_number"
        />
        <span class="text-3xl font-semibold mr-auto flex flex-row items-center gap-4">

          <ClubFlag
            :conf="props.conf"
            :item="r"
          />
          {{ r.name }}
        </span>
        <span
          class="text-lg tabular-nums"
          v-text="timeDiffLabel(r.start_time_ts??0)"
        />
      </div>
      <div
        class="
        absolute top-0 bottom-0 right-full text-to-bottom text-center
        text-blue-400 text-2xl font-semibold uppercase p-2 overflow-hidden text-nowrap
      "
      >
        on track
      </div>
    </div>
    <div
      v-if="startWarning.length"
      class=""
    >
      <div
        v-for="r in startWarning"
        class="Admin__StartAlert__row bg-red-200 animate-pulse relative"
      >
        <span
          class="font-bold text-4xl text-co-orange tabular-nums"
          v-text="r.bib_number"
        />
        <span class="text-3xl font-semibold mr-auto flex flex-row items-center gap-4">

          <ClubFlag
            :conf="props.conf"
            :item="r"
          />
          {{ r.name }}
        </span>
        <span
          class="text-lg tabular-nums"
          v-text="timeDiffLabel((r.start_time_ts??0) - 3*3600)"
        />

        <div
          class="
          absolute  right-full rounded-full animate-pulse size-6 bg-red-200 mx-4
        "
        />
      </div>
    </div>

    <div
      v-for="r in beforeStart"
      class="Admin__StartAlert__row text-gray-300"
    >
      <span
        class="font-bold text-4xl text-co-orange tabular-nums"
        v-text="r.bib_number"
      />
      <span class="text-3xl font-semibold mr-auto flex flex-row items-center gap-4">
        <ClubFlag
          :conf="props.conf"
          :item="r"
        />
        {{ r.name }}

      </span>
      <span
        class="text-lg tabular-nums"
        v-text="timeDiffLabel(r.start_time_ts??0)"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>
