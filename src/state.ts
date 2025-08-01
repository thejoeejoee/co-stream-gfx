import {useEventSource} from "@vueuse/core";

export const params = new URLSearchParams(window.location.search)
export const {
  eventSource
} = useEventSource(params.get("sse") || 'http://localhost:8080/_sse/default')

// director alerts settings
export const timeOffest = 0
export const alertOffset = 45
