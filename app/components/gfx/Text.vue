<template>
  <div class="Text">
    <div
      v-if="$slots.icon"
      class="Text__Icon"
    >
      <slot name="icon" />
    </div>
    <div
      v-else
      class="Text__Gutter"
    >
&nbsp;
    </div>
    <span class="Text__Content">
      <slot name="default" />
      <slot name="right" />
    </span>
    <slot name="right-gutter" />
  </div>
</template>

<script setup lang="ts">
</script>
