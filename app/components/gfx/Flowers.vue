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
      <span v-if="second.length" class="self-stretch flex items-center bg-gfx-primary text-gfx-on-primary p-4 px-6">{{ second[0].position }}</span>
      <div class="flex flex-col w-full">
        <span
          v-for="runner in second"
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
    <div class="w-1/3" :class="first.length === 1 ? 'text-lg' : ''">
      <span v-if="first.length" class="self-stretch flex items-center bg-gfx-primary text-gfx-on-primary" :class="first.length === 1 ? 'p-6 px-6' : 'p-4 px-6'">{{ first[0].position }}</span>
      <div class="flex flex-col w-full">
        <span
          v-for="runner in first"
          :key="runner.name"
          class="w-full flex flex-row items-center justify-between bg-gfx-surface gap-x-4"
          :class="first.length === 1 ? 'p-6' : 'p-4'"
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
    <div class="w-1/3 text-md">
      <span v-if="third.length" class="self-stretch flex items-center bg-gfx-primary text-gfx-on-primary p-4 px-6">{{ third[0].position }}</span>
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
  const d = props.data.data ?? []
  if (!d.length) return []
  const pos = d[0].position
  return d.filter(r => r.position === pos)
})
const second = computed(() => {
  const d = props.data.data ?? []
  const firstPos = d[0]?.position
  if (!firstPos) return []
  const rest = d.filter(r => r.position !== firstPos)
  if (!rest.length) return []
  const pos = rest[0].position
  return rest.filter(r => r.position === pos)
})
const third = computed(() => {
  const d = props.data.data ?? []
  const firstPos = d[0]?.position
  const secondPos = second.value[0]?.position
  if (!firstPos) return []
  return d.filter(r => r.position !== firstPos && r.position !== secondPos)
})

</script>
