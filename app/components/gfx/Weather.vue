<template>
  <div
    class="
    Table
    text-md text-semibold
    text-right
    font-gfx
    rounded-[var(--gfx-radius)] overflow-hidden
   "
  >
    <div class="Table__Title Table__Title--highlight Animate__Slide">
      {{ data.place || data.title }}
    </div>
    <div class="Table__Flex Animate__Clip">
      <div class="Table__Row">
        <IconTemperature
          v-if="!isIOF"
          stroke="2"
          size="48"
          class="text-gfx-primary"
        />
        {{ data.temperature }}
      </div>
      <div class="Table__Row">
        <IconDroplets
          v-if="!isIOF"
          stroke="2"
          size="48"
          class="text-gfx-primary"
        />
        {{ data.humidity }}
      </div>
      <div class="Table__Row">
        <IconWind
          v-if="!isIOF"
          stroke="2"
          size="48"
          class="text-gfx-primary"
        />
        {{ data.wind_speed }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconDroplets, IconTemperature, IconWind } from '@tabler/icons-vue'
import type { IWeather } from '~/types/api.d'
import { useTheme } from '~/composables/useTheme'

defineProps<{
  data: IWeather
}>()

const { isIOF } = useTheme()
</script>
