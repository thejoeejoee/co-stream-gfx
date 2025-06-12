<template>
  <div class="Table">
    <div class="TableFooter">
      <span v-text="data.label"></span>
      <span v-text="data.class"></span>
      <!--      <span class="Gfx__Control Gfx__Control&#45;&#45;finish"><span></span></span>-->
    </div>

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

        <span class="Table__Flag">
          <span v-if="row.club" v-text="row.club" class="Table__Club"></span>
          <Flag :country="row.nationality" v-if="row.nationality"/>
        </span>
        <span class="Table__Time" v-text="row.start_time" v-if="row.start_time"></span>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import Flag from "@/components/Flag.vue";
import type {IStartList} from "@/types/api";

defineProps<{
  data: IStartList
}>();
</script>