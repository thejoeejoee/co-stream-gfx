<template>
  <div class="Table min-w-[calc((2.5*64)*var(--spacing))]">
    <TransitionGroup class="Table__Flex" tag="div" name="list">
      <!-- leader row -->
      <div
          v-if="data.has_leader"
          class="Table__Row Table__Row--leader"
          :key="data.leader.name"
      >
        <span
            class="Table__Position"
            v-html="data.leader.position"
        ></span>
        <span class="Table__Name" v-text="data.leader.name"></span>
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
        <span class="Table__Time" v-text="data.leader.time"></span>
      </div>

      <div
          class="Table__Row"
          v-for="(row, index) in data.data?.filter((r) => r.name && r.name.length > 0) || []"
          :data-index="index"
          :key="row.name || index"
          :class="{
            'Table__Row--highlight': index === data.row_idx,
          }"
      >
        <span
            class="Table__Position"
            v-html="row.position"
        ></span>
        <span class="Table__Name" v-text="row.name"></span>
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
        <span class="Table__Time" v-text="row.time"></span>
      </div>

  </TransitionGroup>
    <div class="Table__Title">
      <span
          class="Gfx__Control"
          :class="{'Gfx__Control--finish': data.finish}"
      ><span></span></span>
      <span v-text="data.label"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'
import type {ILiveFeed} from "@/types/api";
import Flag from "@/components/Flag.vue";
import PositionChangeSymbol from "@/components/PositionChangeSymbol.vue";
import ClubFlag from "@/components/ClubFlag.vue";

// property
defineProps<{
  data: ILiveFeed
}>();

</script>