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
      <span class="bg-gfx-primary text-gfx-on-primary p-4 px-6">{{ second?.position }}</span>
      <span class="p-4 w-full flex flex-row items-center justify-between bg-gfx-surface gap-x-4">
        {{ second?.name }}
        <club-flag
          v-if="second"
          :conf="data"
          :item="second"
          club-class="text-gfx-primary"
        />
      </span>
    </div>
    <div class="w-1/3 text-lg">
      <span class="bg-gfx-primary text-gfx-on-primary p-6 px-6">{{ first?.position }}</span>
      <span class="p-6 w-full flex flex-row items-center justify-between bg-gfx-surface gap-x-4">
        {{ first?.name }}
        <club-flag
          v-if="first"
          :conf="data"
          :item="first"
          club-class="text-gfx-primary"
        />
      </span>
    </div>
    <div class="w-1/3 text-md">
      <span class="bg-gfx-primary text-gfx-on-primary p-4 px-6">{{ third?.position }}</span>
      <span class="p-4 w-full flex flex-row items-center justify-between bg-gfx-surface gap-x-4">
        {{ third?.name }}
        <club-flag
          v-if="third"
          :conf="data"
          :item="third"
          club-class="text-gfx-primary"
        />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFlowers } from '~/types/api.d'
import { computed } from 'vue'
import ClubFlag from './../ClubFlag.vue'

const props = defineProps<{
  data: IFlowers
}>()

const first = computed(() => {
  return props.data.data?.find(item => item.position === '1')
})
const second = computed(() => {
  return props.data.data?.find(item => item.position === '2')
})
const third = computed(() => {
  return props.data.data?.find(item => item.position === '3')
})

</script>
