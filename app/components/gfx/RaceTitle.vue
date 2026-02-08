<template>
  <Transition
    name="nested-slide"
    appear
  >
    <div
      v-if="data"
      class="RaceTitle"
    >
      <div
        class="RaceTitle__Title Animate__Slide gradient-animated"
        style="
          background: linear-gradient(135deg, var(--color-co-orange) 0%, var(--color-co-orange-dark) 100%);
          background-size: 200% 200%;
          box-shadow: var(--shadow-glow);
        "
      >
        {{ data.title }}
      </div>
      <div
        class="RaceTitle__Subtitle Animate__Clip"
        style="
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--shadow-md);
        "
      >
        <span class="flex items-center race-detail" style="column-gap: 0.5rem">
          <IconCalendarWeek
            size="48"
            stroke="1.5"
            class="race-icon"
          />
          <AnimatedText variant="body">
            {{ data.date }}
          </AnimatedText>
        </span>
        <span class="flex items-center race-detail" style="column-gap: 0.5rem">
          <AnimatedText variant="body">
            {{ data.place }}
          </AnimatedText>
          <IconMapPin
            size="48"
            stroke="1.5"
            class="race-icon"
          />
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconCalendarWeek, IconMapPin } from '@tabler/icons-vue'
import type { IRaceTitle } from '~/types/api.d'
import AnimatedText from '~/components/core/AnimatedText.vue'

defineProps<{
  data: IRaceTitle
}>()
</script>

<style scoped>
.race-detail {
  transition: all var(--transition-speed) var(--transition-smooth);
}

.race-detail:hover {
  transform: scale(1.05);
}

.race-icon {
  transition: transform var(--transition-speed) var(--transition-timing);
}

.race-detail:hover .race-icon {
  transform: rotate(10deg);
  color: var(--color-co-orange);
}
</style>

