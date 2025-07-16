<template>
  <div class="
    Table
    text-md text-semibold
    text-right
    font-co
    rounded-md overflow-hidden
   ">
    <div class="Table__Title Table__Title--highlight Animate__Slide">
      {{ data.place || data.title }}
    </div>
    <div class="Table__Flex Animate__Clip">
      <div class="Table__Row">
        <IconTemperature stroke="2" size="48" class="text-co-orange"/>
        {{ data.temperature }}
      </div>
      <div class="Table__Row">
        <IconDroplets stroke="2" size="48" class="text-co-orange"/>
        {{ data.humidity }}
      </div>
      <div class="Table__Row">
        <IconWind stroke="2" size="48" class="text-co-orange"/>
        {{ data.wind_speed }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {IconDroplets, IconTemperature, IconWind} from '@tabler/icons-vue';
import type {IWeather} from "@/types/api";


defineProps<{
  data: IWeather
}>();
</script>