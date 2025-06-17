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
    [&_div]:gap-x-16
    divide-gray-200 divide-y-1
    rounded-md overflow-hidden
   ">
    <div class="
      bg-co-orange text-co-beige
        text-xl h-24 italic font-semibold px-8
    ">
      {{ data.class }}
    </div>
    <template v-for="(item, index) in data.data" >
      <div class="px-4 text-md" :key="index" v-if="item.value">
      <span class="text-co-orange">
        {{ item.key.toLowerCase() }}
      </span>
        {{ item.value }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

import type {IParameters} from "@/types/api";

defineProps<{
  data: IParameters
}>();
</script>