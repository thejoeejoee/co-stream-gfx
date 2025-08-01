<template>
  <div class="Time">
<!--    <IconStopwatch size="64" stroke="2"/>-->
    <div class="font-co font-bold italic mr-4" v-text="prefix"></div>
    <span
        v-if="stopwatch.hours.value > 0"
    >{{ stopwatch.hours.value.toString().padStart(1, '0') + ':' }}</span>
    <span
    >{{ stopwatch.minutes.value.toString().padStart(1, '0') + ':' }}</span>
    <span>{{ stopwatch.seconds.value.toString().padStart(2, '0') }}</span>
  </div>
</template>

<script setup lang="ts">
// import { computed, ref } from "vue";
import {useStopwatch} from 'vue-timer-hook';

import {IconStopwatch} from "@tabler/icons-vue";


const props = defineProps<{
  prefix: string
  offset: number
}>();


const stopwatch = useStopwatch((props.offset || 0) + (new Date()).getSeconds() / 1000, true);

</script>