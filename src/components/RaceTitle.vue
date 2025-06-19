<template>
  <div class="RaceTitle">
    <div class="RaceTitle__Title Animate__Slide">
      {{ data.title }}
    </div>
    <div class="RaceTitle__Subtitle Animate__Clip">
      <span class="flex items-center">
        <IconCalendarWeek size="48" stroke="1.5"/>
        {{ data.date }}
      </span>
      <span class="flex items-center">
        {{ data.place }}
        <IconMapPin size="48" stroke="1.5"/>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {IconCalendarWeek, IconMapPin} from "@tabler/icons-vue";
import type {IRaceTitle} from "@/types/api";

defineProps<{
  data: IRaceTitle
}>();
</script>