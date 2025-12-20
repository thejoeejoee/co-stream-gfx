<template>
  <div
    class="
    Table
    text-lg text-semibold
    text-co-black
    text-right
    font-co
    rounded-md overflow-hidden
   "
  >
    <div class="Table__Title Table__Title--highlight Animate__Slide">
      {{ data.class }}
    </div>

    <div class="Table__Flex Animate__Clip">
      <template v-for="(item, index) in data.data">
        <div
          v-if="item.value"
          :key="index"
          class="text-md w-full Table__Row"
        >
          <span class="text-co-orange">
            {{ item.key.toLowerCase() }}
          </span>
          {{ item.value }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IParameters } from '~/types/api.d'

defineProps<{
  data: IParameters
}>()
</script>
