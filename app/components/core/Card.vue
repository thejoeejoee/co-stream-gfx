<template>
  <div
    ref="cardRef"
    class="gfx-card"
    :class="[
      variantClass,
      { 'gfx-card--glow': glow, 'gfx-card--shimmer': shimmer }
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useSpringAnimation } from '~/composables/useAnimations'

interface Props {
  variant?: 'default' | 'highlight' | 'leader'
  glow?: boolean
  shimmer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  glow: false,
  shimmer: false
})

const cardRef = ref<HTMLElement>()

// Apply spring animation on mount
useSpringAnimation(cardRef, {
  stiffness: 400,
  damping: 25,
  duration: 400
})

const variantClass = computed(() => {
  return `gfx-card--${props.variant}`
})
</script>

<style scoped>
.gfx-card {
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 300ms;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  box-shadow: var(--shadow-md);
}

.gfx-card--default {
  border: 1px solid rgb(229 231 235 / 0.5);
}

.gfx-card--highlight {
  border: 2px solid var(--color-co-orange);
  box-shadow: var(--shadow-lg), 0 0 32px oklch(65% 0.19 35 / 0.2);
  transform: scale(var(--scale-highlight));
}

.gfx-card--leader {
  background: linear-gradient(
    135deg,
    var(--color-co-orange) 0%,
    var(--color-co-orange-dark) 100%
  );
  color: var(--color-co-beige);
  box-shadow: var(--shadow-glow);
}

.gfx-card--glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.gfx-card--shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    oklch(100% 0 0 / 0.3) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}
</style>
