import { ref, watch, computed } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import type { Ref } from 'vue'
import { fetchOResults, applyPunchFinishTimes } from '~/utils/psResults'
import type { OResultsClass, OResultsEvent, OResultsPunch, OResultsRunner } from '~/utils/psResults'

export function useOResultsPolling(
  eventId: Ref<number | null>,
  interval: Ref<number>
) {
  const rawRunners = ref<OResultsRunner[]>([])
  const classes = ref<OResultsClass[]>([])
  const punches = ref<OResultsPunch[]>([])
  const eventInfo = ref<OResultsEvent | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdate = ref<Date | null>(null)
  const lastChangeId = ref(0)

  const runners = computed(() => applyPunchFinishTimes(rawRunners.value, punches.value))

  const refresh = async () => {
    if (eventId.value === null) return

    isLoading.value = true
    try {
      const response = await fetchOResults(eventId.value, lastChangeId.value)

      if (lastChangeId.value === 0) {
        rawRunners.value = response.runners
        classes.value = response.classes
        punches.value = response.punches ?? []
      }
      else {
        const runnerMap = new Map(rawRunners.value.map(r => [r.id, r]))
        for (const runner of response.runners) {
          runnerMap.set(runner.id, runner)
        }
        rawRunners.value = [...runnerMap.values()]

        const classMap = new Map(classes.value.map(c => [c.id, c]))
        for (const cls of response.classes) {
          classMap.set(cls.id, cls)
        }
        classes.value = [...classMap.values()]

        if (response.punches?.length) {
          punches.value = [...punches.value, ...response.punches]
        }
      }

      if (response.deletedRunners.length > 0) {
        const deleted = new Set(response.deletedRunners)
        rawRunners.value = rawRunners.value.filter(r => !deleted.has(r.id))
      }

      if (response.event) {
        eventInfo.value = response.event
      }
      lastChangeId.value = response.lastChangeId
      lastUpdate.value = new Date()
      error.value = null
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    }
    finally {
      isLoading.value = false
    }
  }

  const { pause, resume } = useIntervalFn(
    () => { if (eventId.value) void refresh() },
    interval,
    { immediate: false }
  )

  watch(eventId, (newId) => {
    if (newId === null) {
      rawRunners.value = []
      classes.value = []
      punches.value = []
      eventInfo.value = null
      error.value = null
      lastChangeId.value = 0
      lastUpdate.value = null
      pause()
    }
    else {
      lastChangeId.value = 0
      rawRunners.value = []
      classes.value = []
      punches.value = []
      error.value = null
      void refresh().then(() => resume())
    }
  }, { immediate: true })

  return {
    runners,
    classes,
    eventInfo,
    isLoading,
    error,
    lastUpdate,
    refresh,
    pause,
    resume,
  }
}
