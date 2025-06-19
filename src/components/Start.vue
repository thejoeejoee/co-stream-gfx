<template>
  <Text class="Animate__Slide">
    <template v-slot:icon v-if="start.bib_number">
      <span
          v-text="start.bib_number"
          class="text-lg font-semibold"
      ></span>
    </template>
    <span v-text="start.name" class="mr-auto"></span>

    <template v-slot:right v-if="start.nationality">
      <club-flag
          :conf="start"
          :item="start"
          club-class="text-co-orange"
      />
    </template>
    <template v-slot:right-gutter v-if="start.start_time">
      <span
          class="text-lg bg-co-orange text-co-beige p-6 font-semibold"
          v-text="start.start_time"
      ></span>
    </template>
  </Text>
  <div v-if="start.detail" class="text-md p-4 bg-co-orange text-co-beige font-co Animate__Clip">
    {{ start?.detail }}
  </div>
</template>
<script setup lang="ts">
import type {IStartDetail} from "@/types/api";
import ClubFlag from "@/components/ClubFlag.vue";
import Text from "@/components/Text.vue";

defineProps<{
  start: IStartDetail
}>()
</script>