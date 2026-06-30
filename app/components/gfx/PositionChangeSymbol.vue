<template>
  <span
    v-if="change !== null"
    class="text-md font-sans"
    :class="css"
  >
    {{ change != 0 ? Math.abs(change) : '' }}
    <span v-text="symbol" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  change: number | null
  noColor?: boolean
}>()

const css = computed(() => {
  if (props.noColor) return ''
  switch (props.change) {
    case null:
      return ''
    case 0:
      return 'text-gfx-split-neutral'
    default:
      return props.change < 0 ? 'text-gfx-split-negative' : 'text-gfx-split-positive'
  }
})
const symbol = computed(() => {
  if (props.change === null) return ''
  if (props.change === 0) return '■'
  return props.change < 0 ? '▲' : '▼'
})
</script>
