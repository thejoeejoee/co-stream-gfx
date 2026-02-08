<template>
  <div
    ref="textRef"
    class="animated-text"
    :class="[`animated-text--${variant}`, animationClass]"
    :style="customStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'title' | 'subtitle' | 'body' | 'highlight'
  gradient?: boolean
  glow?: boolean
  animate?: 'fade' | 'slide' | 'bounce' | null
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body',
  gradient: false,
  glow: false,
  animate: null
})

const textRef = ref<HTMLElement>()

const animationClass = computed(() => {
  if (!props.animate) return ''
  return `animate-${props.animate}`
})

const customStyle = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.gradient) {
    styles.background = 'linear-gradient(135deg, var(--color-co-orange) 0%, var(--color-co-orange-light) 100%)'
    styles.backgroundClip = 'text'
    styles.webkitBackgroundClip = 'text'
    styles.webkitTextFillColor = 'transparent'
  }
  
  if (props.glow) {
    styles.textShadow = '0 0 20px var(--color-co-orange)'
  }
  
  return styles
})
</script>

<style scoped>
.animated-text {
  font-family: var(--font-co);
  transition: all 300ms;
}

.animated-text--title {
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
  font-weight: 700;
}

.animated-text--subtitle {
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
  font-weight: 600;
  font-style: italic;
}

.animated-text--body {
  font-size: var(--text-md);
  line-height: var(--text-md--line-height);
}

.animated-text--highlight {
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
  font-weight: 700;
  color: var(--color-co-orange);
}

.animate-fade {
  animation: fadeIn var(--transition-speed) var(--transition-smooth);
}

.animate-slide {
  animation: slideLeft var(--transition-speed) var(--transition-timing);
}

.animate-bounce {
  animation: bounce-in 400ms var(--transition-timing);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
