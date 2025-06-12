<template>
  <div class="Table">
    <div class="Table__Title">
      <co-symbol class="fill-co-orange h-[var(--text-lg--line-height)]" />
      <span v-text="data.label" class="mr-auto"></span>
      <span v-text="data.class"></span>
      <!--      <span class="Gfx__Control Gfx__Control&#45;&#45;finish"><span></span></span>-->
    </div>

    <div class="Table__Grid Table__Grid--expand">
      <template
          v-for="(row, index) in data.data"
          :key="row.name || index"
      >
        <div
            class="Table__Row"
            :data-index="index"
            v-if="row.name"
        >
          <span
              class="Table__Position"
              v-html="row.bib_number"
          ></span>
          <span class="Table__Name" v-text="row.name"></span>

          <span class="flex flex-row items-center justify-end gap-x-4">
            <span
                v-if="data.is_national && row.club"
                v-text="row.club"
                class="Table__Club"
            ></span>
            <Flag
                v-if="!data.is_national || data.is_relay"
                :country="row.nationality"
                size="big"
            />
          </span>
          <span class="Table__Time" v-text="row.start_time" v-if="row.start_time"></span>

          <div class="Table__Divider"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import Flag from "@/components/Flag.vue";
import type {IStartList} from "@/types/api";
import CoSymbol from "@/assets/co_symbol.svg?component"

defineProps<{
  data: IStartList
}>();
</script>