import { useEventSource } from '@vueuse/core'

export const params = new URLSearchParams(window.location.search)
export const {
  eventSource
} = useEventSource(params.get('sse') || 'http://localhost:8080/_sse/default', [], {
  autoReconnect: {
    retries: -1,
    delay: 1000,
  }
})

// director alerts settings
export const timeOffset = 0
export const alertOffset = 45
