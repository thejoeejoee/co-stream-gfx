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
          v-html="row.position"
      ></span>
        <span class="Table__Name" v-text="row.name"></span>
        <span class="Table__Flag">
        <country-flag
            v-if="row.nationality"
            :country="row.nationality.toLowerCase()"
            size="big"
        />
      </span>
        <span class="Table__Time" v-text="row.time"></span>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'

type ResultsData = {
  label: string
  class: string
  data: Array<Record<string, string>>
}

import DATA from "./demo/results01.json"

const data: ResultsData = (DATA as unknown) as ResultsData;

</script>