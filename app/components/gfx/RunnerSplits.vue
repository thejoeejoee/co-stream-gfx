<template>
  <div
    class="
    RunnerSplits
    Table
    font-gfx
    rounded-[var(--gfx-radius)] overflow-hidden
   "
  >
    <div class="Table__Flex Animate__Clip">
      <div
        v-for="(split, index) in data.splits.filter(s => s.diff !== null)"
        :key="index"
        class="Table__Row"
      >
        <span class="Table__Name">
          {{ split.control }}
        </span>
        <span
          class="Table__Time RunnerSplits__Diff"
          :class="diffClass(split.diff)"
        >
          {{ formatDiff(split.diff) }}
          <span class="w-[1.5ch] inline-block text-center">
          {{ diffSymbol(split.diff) }}
          </span>
        </span>
      </div>
    </div>

    <div class="Table__Title Animate__Slide">
      <span>{{ data.name }}</span>
      <span>{{ data.class }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IRunnerSplits } from '~/types/api.d'

defineProps<{
  data: IRunnerSplits
}>()

function diffClass(diff: number): string {
  if (diff > 0) return 'RunnerSplits__Diff--positive'
  if (diff < 0) return 'RunnerSplits__Diff--negative'
  return 'RunnerSplits__Diff--neutral'
}

function formatDiff(diff: number): string {
  const sign = diff > 0 ? '+' : diff < 0 ? '-' : ''
  const abs = Math.abs(diff)
  const minutes = Math.floor(abs / 60)
  const seconds = abs % 60
  return `${sign}${minutes}:${seconds.toString().padStart(2, '0')}`
}

function diffSymbol(diff: number): string {
  if (diff > 0) return '▼'
  if (diff < 0) return '▲'
  return '●'
}
</script>

<style lang="postcss" scoped>
.RunnerSplits {
  min-width: 380px;
}

.RunnerSplits__Diff {
  @apply font-bold;
  min-width: calc(1ch + 8ch);  /* symbol + "+0:00 " */
}

.RunnerSplits__Diff--positive {
  color: var(--gfx-color-split-positive);
}

.RunnerSplits__Diff--negative {
  color: var(--gfx-color-split-negative);
}

.RunnerSplits__Diff--neutral {
  color: var(--gfx-color-split-neutral);
}
</style>
