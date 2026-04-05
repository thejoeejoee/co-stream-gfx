<template>
  <div
    v-if="singleRunner !== null"
    class="
    h-36 flex-col

    rounded-[var(--gfx-radius)] overflow-hidden
  "
  >
    <div
      class="
      flex flex-row items-center justify-between
      text-lg bg-gfx-surface
      Animate__Slide
    "
    >
      <span
        v-if="singleRunner.bib_number"
        class="
          flex items-center px-6
          bg-gfx-primary  text-gfx-on-primary
          h-24 font-semibold
        "
        v-text="singleRunner.bib_number"
      />
      <h1
        class="
          h-24 bg-gfx-surface px-6 gap-x-4 w-full
          flex flex-row justify-between items-center
          font-gfx uppercase text-gfx-text
        "
        :class="{ 'border-l-[calc(var(--spacing)*2)] border-l-gfx-primary': !singleRunner.bib_number }"
      >
        {{ stripAccents(singleRunner.name) }}

        <club-flag
          :conf="singleRunner"
          :item="singleRunner"
          club-class="text-gfx-primary"
        />
      </h1>
    </div>

    <h2
      class="
      font-gfx text-md h-12 flex items-center justify-between gap-x-4
      p-4
      bg-gfx-secondary text-gfx-on-secondary
      Animate__Clip
    "
    >
      <span
        class="italic font-semibold"
        v-text="singleRunner.class"
      />
      <span v-text="singleRunner.detail" />
    </h2>
  </div>
</template>

<script setup lang="ts">
import type { ISingleRunner } from '~/types/api.d'
import ClubFlag from './../ClubFlag.vue'
import { stripAccents } from '~/utils/text'

defineProps<{
  singleRunner: ISingleRunner
}>()
</script>
