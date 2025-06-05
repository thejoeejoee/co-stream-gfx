<template>
  <div class="Table">
    <div
        class="Table__Row"
        v-for="(row, index) in [splitData.leader, ...splitData.data]"
        :data-index="index"
        :key="row.name || index"
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

    <div class="TableFooter">
      <span class="Gfx__Control Gfx__Control--finish"><span></span></span>
      <span v-text="splitData.label"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'

type SplitData = {
  label: string
  leader: Record<string, string>
  data: Array<Record<string, string>>
}

import DATA from "./demo/split01.json"

const splitData: SplitData = (DATA as unknown) as SplitData;

</script>