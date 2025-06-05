<template>
  <div class="Text">
    <span v-text="props.text"></span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps(['text'])
</script>