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
      v-text="isIOF ? stripAccents(start.name) : start.name"
    />

    <template
      v-if="start.nationality"
      #right
    >
      <club-flag
        :conf="start"
        :item="start"
        club-class="text-gfx-primary"
      />
    </template>
    <template
      v-if="start.start_time"
      #right-gutter
    >
      <span
        class="text-lg bg-gfx-primary text-gfx-on-primary p-6 font-semibold"
        v-text="start.start_time"
      />
    </template>
  </Text>
  <div
    v-if="start.detail"
    class="text-md p-4 bg-gfx-secondary text-gfx-on-secondary font-gfx Animate__Clip"
  >
    {{ start?.detail }}
  </div>
</template>

<script setup lang="ts">
import type { IStartDetail } from '~/types/api.d'
import ClubFlag from './../ClubFlag.vue'
import Text from './Text.vue'
import { stripAccents } from '~/utils/text'
import { useTheme } from '~/composables/useTheme'

const { isIOF } = useTheme()

defineProps<{
  start: IStartDetail
}>()
</script>
