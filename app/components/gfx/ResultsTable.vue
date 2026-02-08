<template>
  <Transition
    name="nested-slide"
    appear
  >
    <div
      v-if="data"
      class="Table rounded-[var(--border-radius)] overflow-hidden"
    >
      <div class="Table__Title Table__Title--highlight Animate__Slide">
        <span
          class="Gfx__Control Gfx__Control--invert"
          :class="{ 'Gfx__Control--finish': data.finish }"
        ><span /></span>
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
                  <PositionChangeSymbol
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
  </Transition>
</template>

<script setup lang="ts">
import type { IResults } from '~/types/api.d'
import PositionChangeSymbol from '~/components/core/PositionChangeSymbol.vue'
import ClubFlag from './../ClubFlag.vue'

defineProps<{
  data: IResults
}>()
</script>

