<template>
  <div class="Text">
    <div class="Text__Icon" v-if="$slots.icon">
      <slot name="icon"></slot>
    </div>
    <div class="Text__Gutter" v-else>&nbsp;</div>
    <span
        class="Text__Content"
        v-text="props.text"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps(['text'])
</script>