<template>
  <div class="Table min-w-[calc((2*64)*var(--spacing))]">
    <TransitionGroup
      v-if="hasAnyRows"
      class="Table__Flex Animate__Clip"
      tag="div"
      name="list"
    >
      <!-- leader row -->
      <div
        v-if="data.has_leader"
        :key="data.leader.name"
        class="Table__Row Table__Row--leader rounded-t-[var(--gfx-radius)]"
      >
        <span
          class="Table__Position"
          v-text="data.leader.position"
        />
        <span
          class="Table__Name"
          v-text="isIOF ? stripAccents(data.leader.name) : data.leader.name"
        />
        <club-flag
          :conf="data"
          :item="data.leader"
          no-color
        >
          <template #prefix>
            <position-change-symbol
              v-if="data.leader.change !== undefined"
              :change="data.leader.change"
              no-color
            />
          </template>
        </club-flag>
        <span
          class="Table__Time"
          v-text="data.leader.time"
        />
      </div>
      <div
        v-for="(row, index) in data.data?.filter((r) => r.name && r.name.length > 0) || []"
        :key="row.name || index"
        class="Table__Row"
        :data-index="index"
        :class="{
          'Table__Row--highlight rounded-[var(--gfx-radius)]': index === data.row_idx,
          'rounded-t-[var(--gfx-radius)]': index == 0 && !data.has_leader
        }"
      >
        <span
          class="Table__Position"
          v-text="row.position"
        />
        <span
          class="Table__Name"
          v-text="isIOF ? stripAccents(row.name) : row.name"
        />
        <span class="Table__Flag">
          <position-change-symbol
            v-if="row.change !== undefined"
            :change="row.change"
          />
          <club-flag
            :conf="data"
            :item="row"
          />
        </span>
        <span
          class="Table__Time"
          v-text="row.time"
        />
      </div>
    </TransitionGroup>
    <div class="Table__Title rounded-b-[var(--gfx-radius)] Animate__Slide">
      <span
        class="Gfx__Control"
        :class="{ 'Gfx__Control--finish': data.finish }"
      ><span /></span>
      <span v-text="data.label" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILiveFeed } from '~/types/api.d'
import PositionChangeSymbol from './PositionChangeSymbol.vue'
import ClubFlag from './../ClubFlag.vue'
import { stripAccents } from '~/utils/text'
import { useTheme } from '~/composables/useTheme'

const { isIOF } = useTheme()

// property
const { data } = defineProps<{
  data: ILiveFeed
}>()

const hasAnyRows = computed(() => {
  return data.data?.some((r) => r.name && r.name.length > 0) || data.has_leader
})

</script>
