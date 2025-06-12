<template>
  <div class="Text">
    <div class="Text__Icon" v-if="$slots.icon">
      <slot name="icon"></slot>
    </div>
    <div class="Text__Gutter" v-else>&nbsp;</div>
    <span class="Text__Content">
      <slot name="default"/>
      <slot name="right"/>
    </span>
    <slot name="right-gutter"/>
  </div>
</template>

<script setup lang="ts">
</script>