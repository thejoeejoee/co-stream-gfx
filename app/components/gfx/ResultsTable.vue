<template>
  <div class="Table rounded-[var(--gfx-radius)] overflow-hidden">
    <div class="Table__Title Table__Title--highlight Animate__Slide">
      <span
        class="Gfx__Control Gfx__Control--invert"
        :class="{ 'Gfx__Control--finish': data.finish }"
      ><span /></span>
      <img v-if="isIOF" src="/img/iof-logo.png" alt="IOF" class="h-10 w-auto" />
      <span
        class="mr-auto"
        v-text="data.label"
      />
      <span v-text="data.class" />
    </div>

    <TransitionGroup
      name="table"
      tag="div"
      class="Animate__Clip"
    >
      <div
        :key="data.page.toString()+data.data[0]?.name"
        class="Table__Grid Table__Grid--expand"
      >
        <template
          v-for="(row, _) in data.data"
          :key="row.name"
        >
          <template v-if="row.name">
            <span
              class="Table__Position"
              v-html="row.position"
            />
            <span
              class="Table__Name"
              v-text="row.name"
            />
            <club-flag
              :conf="data"
              :item="row"
              club-class="min-w-[3.5ch] text-right"
            >
              <template #prefix>
                <position-change-symbol
                  v-if="row.change !== undefined"
                  :change="row.change"
                />
              </template>
            </club-flag>

            <span
              class="Table__Time"
              v-text="row.time"
            />

            <div class="Table__Divider" />
          </template>
        </template>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { IResults } from '~/types/api.d'
import PositionChangeSymbol from './PositionChangeSymbol.vue'
import ClubFlag from './../ClubFlag.vue'
import { useTheme } from '~/composables/useTheme'

const { isIOF } = useTheme()

defineProps<{
  data: IResults
}>()
</script>
