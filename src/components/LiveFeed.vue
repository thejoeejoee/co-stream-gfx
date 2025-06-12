<template>
  <div class="Table min-w-[calc((2.5*64)*var(--spacing))]">
    <div class="Table__Flex">
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
          <span
              v-if="data.is_national && data.leader.club"
              v-text="data.leader.club"
              class="Table__Club"
          ></span>
          <country-flag
              v-if="!data.is_national || data.is_relay"
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
        <span
            v-if="data.is_national && row.club"
            v-text="row.club"
            class="Table__Club"
        ></span>
        <country-flag
            v-if="!data.is_national || data.is_relay"
            :country="row.nationality.toLowerCase()"
            size="big"
        />
      </span>
      <span class="Table__Time" v-text="row.time"></span>
    </div>

  </div>
    <div class="Table__Title">
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
import type {ILiveFeed} from "@/types/api";

// property
defineProps<{
  data: ILiveFeed
}>();

</script>