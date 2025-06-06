<template>
  <div class="
    flex flex-col
    text-lg text-semibold
    text-co-black bg-white
    text-right
    font-co
    [&_div]:flex
    [&_div]:flex-row
    [&_div]:justify-between
    [&_div]:items-center
    [&_div]:py-3
   ">
    <div class="bg-co-orange text-co-beige text-xl h-24 italic font-semibold px-8">
      {{ data.place }}
    </div>
    <div class="px-4">
      <IconTemperature stroke="2" size="48" class="text-co-orange"/>
      {{ data.temperature }}
    </div>
    <div class="px-4">
      <IconDroplets stroke="2" size="48" class="text-co-orange"/>
      {{ data.humidity }}
    </div>
    <div class="px-4">
      <IconWind stroke="2" size="48" class="text-co-orange"/>
      {{ data.wind_speed }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconTemperature, IconDroplets, IconWind } from '@tabler/icons-vue';
import data from "./demo/weather01.json"
</script>