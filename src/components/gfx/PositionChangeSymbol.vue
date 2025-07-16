<template>
    <span
        v-if="change !== null"
        class="text-md"
        :class="css"
    >
    {{ change != 0 ? Math.abs(change) : '' }}
    <span v-text="symbol"></span>
  </span>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  change: number | null;
  noColor?: boolean;
}>();

const css = computed(() => {
  if (props.noColor) return '';
  switch (props.change) {
    case null:
      return '';
    case 0:
      return 'text-blue-600';
    default:
      return props.change < 0 ? 'text-green-600' : 'text-red-600';
  }
});
const symbol = computed(() => {
  if (props.change === null) return '';
  if (props.change === 0) return '■';
  return props.change < 0 ? '▲' : '▼';
});
</script>