<template>
  <div
    class="
    RunnerSplits
    Table
    font-gfx
    rounded-[var(--gfx-radius)] overflow-hidden
   "
  >
    <div class="Table__Grid Table__Grid--runner-splits Animate__Clip">
      <template
        v-for="(split, index) in data.splits.filter(s => s.diff !== null)"
        :key="index"

      >
        <span class="Table__Name">
          {{ split.control }}
        </span>
        <span class="Table__Flag font-sans justify-end">
           <position-change-symbol
              :change="split.change"          />
        </span>
        <span
          class="Table__Time RunnerSplits__Diff"
          :class="diffClass(split.diff)"
        >

          {{ formatDiff(split.diff) }}


        </span>
      </template>
    </div>

<!--    <div class="Table__Title Animate__Slide">-->
<!--      <span>-->
<!--&lt;!&ndash;        TODO: somehow check if split feed is displayed and show name only if not-->
<!--&ndash;&gt;-->
<!--&lt;!&ndash;        {{ data.name }}&ndash;&gt;-->
<!--      </span>-->
<!--      <span>{{ data.class }}</span>-->
<!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import type { IRunnerSplits } from '~/types/api.d'
import PositionChangeSymbol from "~/components/gfx/PositionChangeSymbol.vue";
import ClubFlag from "~/components/ClubFlag.vue";

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
