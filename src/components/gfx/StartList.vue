<template>
  <div class="Table rounded-md overflow-hidden">
    <div class="Table__Title Animate__Slide">
      <co-symbol class="fill-co-orange h-[var(--text-lg--line-height)]" />
      <span v-text="data.label" class="mr-auto"></span>
      <span v-text="data.class"></span>
      <!--      <span class="Gfx__Control Gfx__Control&#45;&#45;finish"><span></span></span>-->
    </div>

<!--    <div class="Table__Grid Table__Grid&#45;&#45;expand Table__Grid&#45;&#45;no-left-margin" tag="div" name="list">-->
    <TransitionGroup name="table" tag="div" class="Animate__Clip">
      <div
          :key="data.page.toString()+data.data[0]?.name"
          class="Table__Grid Table__Grid--expand Table__Grid--no-empty-gutter-margin">
      <template
          v-for="(row, index) in data.data"
          :key="row.name"
      >
        <template
            v-if="row.name"
        >
          <span
              class="Table__Position"
              v-html="row.bib_number"
          ></span>
          <span class="Table__Name" v-text="row.name"></span>
          <club-flag
              :conf="data"
              :item="row"
          />
          <span class="Table__Time" v-text="row.start_time"></span>

          <div class="Table__Divider"></div>
        </template>
      </template>
    </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import Flag from "@/components/gfx/Flag.vue";
import type {IStartList} from "@/types/api";
import CoSymbol from "@/assets/co_symbol.svg?component"
import ClubFlag from "@/components/ClubFlag.vue";
import PositionChangeSymbol from "@/components/gfx/PositionChangeSymbol.vue";

defineProps<{
  data: IStartList
}>();
</script>