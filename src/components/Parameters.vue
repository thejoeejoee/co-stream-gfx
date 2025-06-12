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
    [&_div]:gap-x-4
    divide-gray-200 divide-y-1
   ">
    <div class="
      bg-co-orange text-co-beige
        text-xl h-24 italic font-semibold px-8
    ">
      {{ data.class }}
    </div>
    <div class="px-4 text-lg" v-for="(item, index) in data.data" :key="index">
      <span class="text-co-orange">
        {{ (item as any).key.toLowerCase() }}
      </span>
      {{ (item as any).value }}
    </div>
  </div>
</template>

<script setup lang="ts">

import type {IParameters} from "@/types/api";

defineProps<{
  data: IParameters
}>();
</script>