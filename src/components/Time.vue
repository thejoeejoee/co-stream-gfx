<template>
  <div class="Time">
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
import { useStopwatch } from 'vue-timer-hook';

const stopwatch = useStopwatch(1985, true);
</script>