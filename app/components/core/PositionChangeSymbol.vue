<template>
  <div
    :key="renderKey"
    class="position-change-symbol"
    :class="animationClass"
    :style="{ color: color }"
  >
    <span
      v-if="icon"
      class="position-change-icon"
    >
      {{ icon }}
    </span>
    <span
      v-if="showValue && change !== undefined"
      class="position-change-value"
    >
      {{ Math.abs(change) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { usePositionChange } from '~/composables/useAnimations'

interface Props {
  change?: number
  noColor?: boolean
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  change: undefined,
  noColor: false,
  showValue: false
})

const changeRef = computed(() => props.change)
const { animationClass, icon, color: computedColor } = usePositionChange(changeRef)

const color = computed(() => {
  if (props.noColor) return 'currentColor'
  return computedColor.value
})

// Force re-render when change updates to trigger animation
const renderKey = computed(() => `${props.change}-${Date.now()}`)
</script>

<style scoped>
.position-change-symbol {
  display: inline-flex;
  align-items: center;
  column-gap: 0.25rem;
  font-family: var(--font-co);
  font-weight: 700;
  font-size: var(--text-md);
  line-height: var(--text-md--line-height);
  transition: color 300ms;
}

.position-change-icon {
  display: inline-block;
  animation: bounce-in 400ms var(--transition-timing);
}

.position-change-value {
  font-variant-numeric: tabular-nums;
}

.position-gain {
  color: var(--color-gain);
}

.position-loss {
  color: var(--color-loss);
}
</style>
