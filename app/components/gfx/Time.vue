<template>
  <div class="Time flex flex-row items-center gap-2 bg-[var(--gfx-bg)] text-[var(--gfx-fg)] px-6 py-3 rounded-[var(--gfx-radius)]">
    <span class="font-gfx font-bold italic text-4xl">
      <span v-if="hours > 0">{{ hours }}:</span>
      <span>{{ minutes.toString().padStart(2, '0') }}:</span>
      <span>{{ seconds.toString().padStart(2, '0') }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ITimer } from '~/types/api.d'

const props = defineProps<{
  data: ITimer
}>()

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let interval: ReturnType<typeof setInterval> | null = null

function update() {
  const elapsed = Math.max(0, Math.floor(Date.now() / 1000 - props.data.start_time))
  hours.value = Math.floor(elapsed / 3600)
  minutes.value = Math.floor((elapsed % 3600) / 60)
  seconds.value = elapsed % 60
}

onMounted(() => {
  update()
  interval = setInterval(update, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>
