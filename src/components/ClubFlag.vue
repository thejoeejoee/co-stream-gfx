
<template>
  <div class="Table__ClubFlag">
    <slot name="prefix"></slot>
    <span
        v-if="displayClub"
        v-text="item.club"
        class="Table__Club "
        :class="[{'text-co-orange': !noColor && displayFlag}, clubClass]"
    ></span>
    <Flag
        v-if="displayFlag"
        :country="item.nationality"
        size="big"
    />
    <slot name="suffix"></slot>
  </div>
</template>

<script setup lang="ts">
import Flag from "@/components/Flag.vue";
import {computed} from "vue";
import type {ClubFlagConfiguration} from "@/types/api";

interface WithClubFlag {
  nationality: string;
  club: string;
}

const props = defineProps<{
  conf: ClubFlagConfiguration;
  item: WithClubFlag;
  noColor?: boolean;
  clubClass?: string;
}>();

/*
|           | is_national | !is_national |
|-----------|-------------|--------------|
| is_relay  | club        | club+flag    |
| !is_relay | club        | flag         |
*/

const displayFlag = computed(() => {
  return props.item.nationality && !props.conf.is_national
})
const displayClub = computed(() => {
  return props.item.club && (
      props.conf.is_national || (!props.conf.is_national && props.conf.is_relay)
  )
});

</script>