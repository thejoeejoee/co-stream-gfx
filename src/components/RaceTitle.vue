<template>
  <div class="RaceTitle">
    <div class="RaceTitle__Title">
      {{ data.title }}
    </div>
    <div class="RaceTitle__Subtitle">
      <IconCalendarWeek size="48" stroke="1.5"/>
      {{ data.date }}
    </div>
    <div class="RaceTitle__Subtitle justify-end">
      {{ data.place }}
      <IconMapPin size="48" stroke="1.5"/>
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