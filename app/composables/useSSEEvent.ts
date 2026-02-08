import type { z } from 'zod'

export function useSSEEvent<T>(
  eventSource: Ref<EventSource | null>,
  eventName: string,
  schema: z.ZodType<T>,
  handler: (data: T) => void
) {
  const parseEvent = (event: Event) => {
    try {
      const messageEvent = event as MessageEvent
      const parsed = JSON.parse(messageEvent.data)
      const validated = schema.parse(parsed)
      handler(validated)
    } catch (error) {
      console.error(`Failed to parse ${eventName} event:`, error)
      console.error('Raw event:', event)
    }
  }

  watch(
    () => eventSource.value,
    (source) => {
      if (source) {
        source.addEventListener(eventName, parseEvent)
      }
    },
    { immediate: true }
  )
}
