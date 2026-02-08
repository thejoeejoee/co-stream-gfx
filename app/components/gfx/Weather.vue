<template>
  <Transition
    name="nested-slide"
    appear
  >
    <div
      v-if="data"
      class="
        Table
        text-md text-semibold
        text-right
        font-co
        rounded-[var(--border-radius)] overflow-hidden
      "
    >
      <div
        class="Table__Title Table__Title--highlight Animate__Slide"
        style="
          background: linear-gradient(135deg, var(--color-co-orange) 0%, var(--color-co-orange-dark) 100%);
          background-size: 200% 200%;
        "
        :class="{ 'gradient-animated': true }"
      >
        {{ data.place || data.title }}
      </div>
      <div class="Table__Flex Animate__Clip">
        <div class="Table__Row weather-row">
          <IconTemperature
            stroke="2"
            size="48"
            class="weather-icon"
            style="color: var(--color-co-orange)"
          />
          <AnimatedText
            variant="body"
            class="weather-value"
          >
            {{ data.temperature }}
          </AnimatedText>
        </div>
        <div class="Table__Row weather-row">
          <IconDroplets
            stroke="2"
            size="48"
            class="weather-icon"
            style="color: var(--color-co-orange)"
          />
          <AnimatedText
            variant="body"
            class="weather-value"
          >
            {{ data.humidity }}
          </AnimatedText>
        </div>
        <div class="Table__Row weather-row">
          <IconWind
            stroke="2"
            size="48"
            class="weather-icon"
            style="color: var(--color-co-orange)"
          />
          <AnimatedText
            variant="body"
            class="weather-value"
          >
            {{ data.wind_speed }}
          </AnimatedText>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconDroplets, IconTemperature, IconWind } from '@tabler/icons-vue'
import type { IWeather } from '~/types/api.d'
import AnimatedText from '~/components/core/AnimatedText.vue'

defineProps<{
  data: IWeather
}>()
</script>

<style scoped>
.weather-row {
  justify-content: flex-start;
  column-gap: 1.5rem;
  transition: all var(--transition-speed) var(--transition-smooth);
}

.weather-row:hover {
  transform: translateX(8px);
}

.weather-icon {
  transition: transform var(--transition-speed) var(--transition-timing);
}

.weather-row:hover .weather-icon {
  transform: scale(1.1) rotate(5deg);
}

.weather-value {
  font-weight: 600;
}
</style>

