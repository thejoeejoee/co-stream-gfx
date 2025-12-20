<template>
  <Text class="Animate__Slide">
    <template
      v-if="start.bib_number"
      #icon
    >
      <span
        class="text-lg font-semibold"
        v-text="start.bib_number"
      />
    </template>
    <span
      class="mr-auto"
      v-text="start.name"
    />

    <template
      v-if="start.nationality"
      #right
    >
      <club-flag
        :conf="start"
        :item="start"
        club-class="text-co-orange"
      />
    </template>
    <template
      v-if="start.start_time"
      #right-gutter
    >
      <span
        class="text-lg bg-co-orange text-co-beige p-6 font-semibold"
        v-text="start.start_time"
      />
    </template>
  </Text>
  <div
    v-if="start.detail"
    class="text-md p-4 bg-co-orange text-co-beige font-co Animate__Clip"
  >
    {{ start?.detail }}
  </div>
</template>

<script setup lang="ts">
import type { IStartDetail } from '~/types/api.d'
import ClubFlag from './../ClubFlag.vue'
import Text from './Text.vue'

defineProps<{
  start: IStartDetail
}>()
</script>
