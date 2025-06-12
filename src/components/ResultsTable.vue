<template>
  <div class="Table">
    <div class="Table__Title Table__Title--highlight">
      <span class="Gfx__Control Gfx__Control--finish Gfx__Control--invert"><span></span></span>
      <span v-text="data.label" class="mr-auto"></span>
      <span v-text="data.class"></span>
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
              v-html="row.position"
          ></span>
          <span class="Table__Name" v-text="row.name"></span>
          <span class="flex flex-row items-center justify-end gap-x-4">
            <span v-if="row.club" v-text="row.club" class="Table__Club"></span>
            <Flag
                v-if="row.nationality"
                :country="row.nationality"
            />
          </span>
          <span class="Table__Time" v-text="row.time"></span>

          <div class="Table__Divider"></div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import Flag from "@/components/Flag.vue";
import type {IResults} from "@/types/api";
import CoSymbol from "@/assets/co_symbol.svg"

defineProps<{
  data: IResults
}>();

</script>