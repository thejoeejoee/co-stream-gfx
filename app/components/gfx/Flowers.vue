<template>
  <div
    class="
    flex flex-row justify-between items-center
    font-gfx h-min
    text-md
    *:flex-grow
    *:text-gfx-text
    *:flex
    *:items-start
    *:justify-start
    rounded-t-[var(--gfx-radius)] overflow-hidden
  "
  >
    <div class="w-1/3">
      <span v-if="second" class="bg-gfx-primary text-gfx-on-primary p-4 px-6">{{ second.position }}</span>
      <span
        v-if="second"
        class="p-4 w-full flex flex-row items-center justify-between bg-gfx-surface gap-x-4"
      >
        {{ isIOF ? stripAccents(second.name) : second.name }}
        <club-flag
          :conf="data"
          :item="second"
          club-class="text-gfx-primary"
        />
      </span>
    </div>
    <div class="w-1/3 text-lg">
      <span v-if="first" class="bg-gfx-primary text-gfx-on-primary p-6 px-6">{{ first.position }}</span>
      <span
        v-if="first"
        class="p-6 w-full flex flex-row items-center justify-between bg-gfx-surface gap-x-4"
      >
        {{ isIOF ? stripAccents(first.name) : first.name }}
        <club-flag
          :conf="data"
          :item="first"
          club-class="text-gfx-primary"
        />
      </span>
    </div>
    <div class="w-1/3 text-md">
      <span v-if="third.length" class="bg-gfx-primary text-gfx-on-primary p-4 px-6">{{ third[0].position }}</span>
      <div class="flex flex-col w-full">
        <span
          v-for="runner in third"
          :key="runner.name"
          class="p-4 w-full flex flex-row items-center justify-between bg-gfx-surface gap-x-4"
        >
          {{ isIOF ? stripAccents(runner.name) : runner.name }}
          <club-flag
            :conf="data"
            :item="runner"
            club-class="text-gfx-primary"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFlowers } from '~/types/api.d'
import { computed } from 'vue'
import ClubFlag from './../ClubFlag.vue'
import { stripAccents } from '~/utils/text'
import { useTheme } from '~/composables/useTheme'

const { isIOF } = useTheme()

const props = defineProps<{
  data: IFlowers
}>()

const first = computed(() => {
  return props.data.data?.[0] ?? null
})
const second = computed(() => {
  return props.data.data?.[1] ?? null
})
const third = computed(() => {
  return props.data.data?.slice(2) ?? []
})

</script>
