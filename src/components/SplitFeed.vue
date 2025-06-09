<template>
  <div class="Table min-w-[calc((2.25*64)*var(--spacing))]">
    <div
        v-if="data.has_leader"
        class="Table__Row Table__Row--leader"
    >
      <span
          class="Table__Position"
          v-html="data.leader.position"
      ></span>
      <span class="Table__Name" v-text="data.leader.name"></span>
      <span class="Table__Flag">
        <country-flag
            v-if="data.leader.nationality"
            :country="data.leader.nationality.toLowerCase()"
            size="big"
        />
      </span>
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
        <country-flag
            v-if="row.nationality"
            :country="row.nationality.toLowerCase()"
            size="big"
        />
      </span>
      <span class="Table__Time" v-text="row.time"></span>
    </div>

    <div class="TableFooter">
      <span
          class="Gfx__Control"
          :class="{'Gfx__Control--finish': false}"
      ><span></span></span>
      <span v-text="data.label"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'

import { useStorage } from '@vueuse/core'


// import DATA from "./demo/split01.json"
import type {SplitFeed} from "../../types";
import {computed, ref} from "vue";
import {onKeyStroke} from "@vueuse/core";

const demos = Object.values(import.meta.glob('./demo/split-feeds/*.json', { eager: true })) as SplitFeed[];

console.log(demos)

const i = useStorage("split-feed-demo-index", 0)

const data = computed(() => {
  return demos[i.value % demos.length]
});

onKeyStroke('ArrowRight', (e) => {
  i.value = (i.value + 1) % demos.length;
})
onKeyStroke('ArrowLeft', (e) => {
  i.value = (i.value - 1 + demos.length) % demos.length;
})
onKeyStroke('q', (e) => {
  i.value = 0;
})

onKeyStroke('w', (e) => {
  i.value = 1;
})
onKeyStroke('e', (e) => {
  i.value = 2;
})




</script>