<template>
  <div class="Time">
    <IconStopwatch size="64" stroke="2"/>
    <span
        v-if="stopwatch.hours.value > 0"
    >{{ stopwatch.hours.value.toString().padStart(2, '0') + ':' }}</span>
    <span
    >{{ stopwatch.minutes.value.toString().padStart(2, '0') + ':' }}</span>
    <span>{{ stopwatch.seconds.value.toString().padStart(2, '0') }}</span>
  </div>
</template>

<script setup lang="ts">
// import { computed, ref } from "vue";
import {useStopwatch} from 'vue-timer-hook';

import {IconStopwatch} from "@tabler/icons-vue";


const stopwatch = useStopwatch(1985, true);
</script>