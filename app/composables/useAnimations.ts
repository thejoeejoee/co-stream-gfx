import { useMotion } from '@vueuse/motion'

export interface SpringAnimationOptions {
  stiffness?: number
  damping?: number
  mass?: number
  duration?: number
}

/**
 * Spring animation composable for smooth, physics-based motion
 */
export function useSpringAnimation(
  target: Ref<HTMLElement | null | undefined>,
  options: SpringAnimationOptions = {}
) {
  const {
    stiffness = 300,
    damping = 20,
    mass = 1,
    duration = 500
  } = options

  const motionInstance = useMotion(target, {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness,
        damping,
        mass,
        duration
      }
    },
    leave: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 300,
        ease: 'easeOut'
      }
    }
  })

  const bounce = () => {
    motionInstance?.apply({
      scale: 1.1,
      transition: { duration: 200 }
    })
    setTimeout(() => {
      motionInstance?.apply({
        scale: 1,
        transition: { type: 'spring', stiffness: 400 }
      })
    }, 200)
  }

  const pulse = () => {
    motionInstance?.apply({
      scale: 1.05,
      transition: { duration: 300, repeat: 2, repeatType: 'reverse' as const }
    })
  }

  const shake = () => {
    motionInstance?.apply({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 400 }
    })
  }

  return {
    motionInstance,
    bounce,
    pulse,
    shake
  }
}

/**
 * Position change animation
 */
export function usePositionChange(change: Ref<number | undefined>) {
  const animationClass = computed(() => {
    if (!change.value) return ''
    if (change.value > 0) return 'position-gain'
    if (change.value < 0) return 'position-loss'
    return ''
  })

  const icon = computed(() => {
    if (!change.value) return null
    return change.value > 0 ? '↗' : '↘'
  })

  const color = computed(() => {
    if (!change.value) return 'var(--color-neutral)'
    return change.value > 0 ? 'var(--color-gain)' : 'var(--color-loss)'
  })

  return {
    animationClass,
    icon,
    color
  }
}
