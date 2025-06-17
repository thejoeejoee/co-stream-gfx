<template>
  <div class="Table rounded-md overflow-hidden">
    <div class="Table__Title Table__Title--highlight">
      <span
          class="Gfx__Control Gfx__Control--invert"
          :class="{'Gfx__Control--finish': data.finish}"
      ><span></span></span>
      <span v-text="data.label" class="mr-auto"></span>
      <span v-text="data.class"></span>
    </div>

    <TransitionGroup name="table" tag="div">
    <div class="Table__Grid Table__Grid--expand" :key="data.page">
      <template
          v-for="(row, _) in data.data"
          :key="row.name"
      >
        <template v-if="row.name">
          <span
              class="Table__Position"
              v-html="row.position"
          ></span>
          <span class="Table__Name" v-text="row.name"></span>
          <club-flag
              :conf="data"
              :item="row"
              clubClass="min-w-[3.5ch] text-right"
          >
            <template #prefix>
              <position-change-symbol
                  v-if="row.change !== undefined"
                  :change="row.change"
              />
            </template>
          </club-flag>

          <span class="Table__Time" v-text="row.time"></span>

          <div class="Table__Divider"></div>
        </template>

      </template>
    </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import Flag from "@/components/Flag.vue";
import type {IResults} from "@/types/api";
import CoSymbol from "@/assets/co_symbol.svg"
import {rand} from "@vueuse/shared";
import PositionChangeSymbol from "@/components/PositionChangeSymbol.vue";
import ClubFlag from "@/components/ClubFlag.vue";

defineProps<{
  data: IResults
}>();

</script>