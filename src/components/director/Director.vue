<script setup lang="ts">
import {useNow} from '@vueuse/core'
import {computed} from "vue";
import DirectorStartAlrt from "@/components/director/DirectorStartAlert.vue";
import type {IStartList, IStartListRunner} from "@/types/api";

const now = useNow()
const nowTs = computed(() => now.value.getTime() / 1000)

interface IStartList {
  class: string
  data: IStartListRunner[]
}

const data: IStartList[] = [
  {
    "class": "H21",
    "data": [
      {name: "Jan Novák", bib_number: "10", start_time_ts: nowTs.value - 150, nationality: 'CZE'},
      {name: "Petr Svoboda", bib_number: "23", start_time_ts: nowTs.value - 130, nationality: 'CZE'},
      {name: "Aleš František", bib_number: "26", start_time_ts: nowTs.value - 55, nationality: 'DJI'},
      {name: "Dan Konečný", bib_number: "30", start_time_ts: nowTs.value + 199, nationality: 'GUA'},
      {name: "Jan Chvátal", bib_number: "45", start_time_ts: nowTs.value + 160, nationality: 'KIR'},
      {name: "Martin Černý", bib_number: "60", start_time_ts: nowTs.value + 286, nationality: 'BOL'},
      {name: "Lukáš Dvořák", bib_number: "71", start_time_ts: nowTs.value + 430, nationality: 'CZE'},
    ]
  },
  {
    "class": "D21",
    "data": [
      {name: "Jana Nováková", bib_number: "10", start_time_ts: nowTs.value + 120, nationality: 'CZE'},
      {name: "Petra Svobodová", bib_number: "11", start_time_ts: nowTs.value + 275, nationality: 'CZE'},
      {name: "Martina Černá", bib_number: "12", start_time_ts: nowTs.value + 391, nationality: 'CZE'},
      {name: "Luka Dvořáková", bib_number: "13", start_time_ts: nowTs.value + 498, nationality: 'CZE'},
    ]
  },
]
console.log(data)
</script>

<template>
  <div class="h-screen">
    <div class="flex flex-row items-top justify-between">
      <div class="p-4 font-black uppercase text-to-bottom text-4xl bg-amber-200 h-full text-center">
        FAVORITE RUNNERS
      </div>
      <div v-for="col in data" class="mx-auto">
        <h2 v-text="col.class" class="text-6xl text-center p-4"></h2>

        <DirectorStartAlrt :data="col.data" :conf="{is_national: false, is_relay: false}"/>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.text-to-bottom {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
</style>