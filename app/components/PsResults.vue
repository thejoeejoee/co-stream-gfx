<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOResultsPolling } from '~/composables/useOResultsPolling'
import { computeGroupStandings, computeMostTeams, DEFAULT_CATEGORY_GROUPS, parseEventInput } from '~/utils/psResults'
import type { CategoryGroup } from '~/utils/psResults'

const route = useRoute()
const router = useRouter()

const initialEvent = route.query.event ? parseEventInput(String(route.query.event)) : null

const eventIdInput = ref(initialEvent ? String(initialEvent) : '')
const eventId = ref<number | null>(initialEvent)
const intervalSeconds = ref(15)
const interval = computed(() => intervalSeconds.value * 1000)
const configOpen = ref(!initialEvent)
const validationError = ref<string | null>(null)

const categoryGroups = ref<CategoryGroup[]>(DEFAULT_CATEGORY_GROUPS)

const { runners, eventInfo, isLoading, error, lastUpdate } = useOResultsPolling(eventId, interval)

// Time slider: filter results to a specific point in time
const timeSliderValue = ref(Date.now())
const isLive = ref(true)

const minStartTime = computed(() => {
  let min = Infinity
  for (const r of runners.value) {
    if (r.startTime && r.startTime < min) min = r.startTime
  }
  return min === Infinity ? Date.now() : min
})

const maxTime = computed(() => {
  let max = 0
  for (const r of runners.value) {
    if (r.finishTime && r.finishTime > max) max = r.finishTime
  }
  return max || Date.now()
})

// Keep slider pinned to latest data when live
watch(lastUpdate, () => {
  if (isLive.value) {
    timeSliderValue.value = maxTime.value
  }
})

function onSliderInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  timeSliderValue.value = val
  isLive.value = val >= maxTime.value - 1000
}

function resetToLive() {
  isLive.value = true
  timeSliderValue.value = maxTime.value
}

const filteredRunners = computed(() => {
  if (isLive.value) return runners.value
  const cutoff = timeSliderValue.value
  return runners.value.map(r => {
    // If runner finished after the cutoff, treat as still running
    if (r.finishTime && r.finishTime > cutoff) {
      return { ...r, finishTime: null, resultStatus: null }
    }
    return r
  })
})

const sliderTimeLabel = computed(() => {
  if (isLive.value) return 'Živě'
  const d = new Date(timeSliderValue.value)
  return d.toLocaleTimeString('cs-CZ')
})

const standings = computed(() => {
  const allClasses = categoryGroups.value.flatMap(g => g.classes)
  const globalMostTeams = computeMostTeams(filteredRunners.value, allClasses)
  const globalWinPoints = globalMostTeams * 2
  return categoryGroups.value.map(group => computeGroupStandings(filteredRunners.value, group, 2, globalWinPoints))
})

const classOverviews = computed(() => {
  const result = new Map<string, Array<{ className: string; top: typeof runners.value; running: typeof runners.value }>>()
  for (const group of categoryGroups.value) {
    const overviews: Array<{ className: string; top: typeof runners.value; running: typeof runners.value }> = []
    for (const cls of group.classes) {
      const classRunners = filteredRunners.value.filter(r => r.className === cls)
      const finished = classRunners
        .filter(r => r.resultStatus === 'OK' && r.finishTime && r.startTime && r.club !== '')
        .sort((a, b) => (a.finishTime! - a.startTime!) - (b.finishTime! - b.startTime!))
      const top = finished.slice(0, 2)
      const running = classRunners.filter(r => r.startTime && !r.finishTime && r.resultStatus === null)
      if (top.length > 0 || running.length > 0) {
        overviews.push({ className: cls, top, running })
      }
    }
    result.set(group.name, overviews)
  }
  return result
})

// Running runners indexed by className+club for team detail display
const runningByClassAndClub = computed(() => {
  const map = new Map<string, typeof runners.value>()
  for (const r of filteredRunners.value) {
    if (r.startTime && !r.finishTime && r.resultStatus === null && r.club !== '') {
      const key = `${r.className}::${r.club}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(r)
    }
  }
  return map
})

function getRunningRunners(className: string, club: string) {
  return runningByClassAndClub.value.get(`${className}::${club}`) ?? []
}

function elapsedSince(startTime: number): string {
  const elapsed = timeSliderValue.value - startTime
  const sec = Math.floor(elapsed / 1000)
  const min = Math.floor(sec / 60)
  if (min > 0) return `+${min}min`
  return `+${sec}s`
}

const formattedLastUpdate = computed(() => {
  if (!lastUpdate.value) return 'Nikdy'
  return lastUpdate.value.toLocaleTimeString('cs-CZ')
})

function handleLoad() {
  const parsed = parseEventInput(eventIdInput.value)
  if (parsed === null) {
    validationError.value = 'Neplatná událost'
    return
  }
  validationError.value = null
  eventId.value = parsed
  router.replace({ query: { ...route.query, event: String(parsed) } })
}

watch(lastUpdate, (val) => {
  if (val && configOpen.value) {
    configOpen.value = false
  }
})

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <header class="mb-6">
      <h1 v-if="!eventInfo" class="text-3xl font-bold">
        Neoficiální výsledky přeboru škol
      </h1>
      <p v-if="eventInfo" class="text-lg text-gray-600">
        {{ eventInfo.name }}
      </p>
      <p v-else-if="isLoading && eventId" class="text-lg text-gray-400">
        načítání...
      </p>
      <div class="flex items-center gap-3 mt-2">
        <span class="text-sm text-gray-500">
          Naposledy aktualizováno: {{ formattedLastUpdate }}
        </span>
        <UIcon v-if="isLoading" name="i-lucide-loader-circle" class="animate-spin" />
      </div>
      <p v-if="eventInfo" class="text-sm text-gray-500 mt-1">
        Neoficiální výsledky přeboru škol
      </p>
      <p v-if="error" class="text-red-600 text-sm mt-1">
        {{ error }}
      </p>
    </header>

    <!-- Config form -->
    <section class="mb-6 border rounded p-4">
      <button class="font-semibold text-sm" @click="configOpen = !configOpen">
        Nastavení {{ configOpen ? '▾' : '▸' }}
      </button>

      <div v-show="configOpen" class="mt-4 flex flex-col gap-4">
        <div class="flex items-end gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Událost</label>
            <UInput
              v-model="eventIdInput"
              placeholder="ID nebo URL události (např. 308)"
              class="w-72"
              @keyup.enter="handleLoad"
            />
            <span v-if="validationError" class="text-red-600 text-xs">{{ validationError }}</span>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Interval (s)</label>
            <select
              v-model.number="intervalSeconds"
              class="border rounded px-2 py-1.5 text-sm"
            >
              <option :value="10">
                10
              </option>
              <option :value="15">
                15
              </option>
              <option :value="20">
                20
              </option>
              <option :value="30">
                30
              </option>
            </select>
          </div>

          <UButton @click="handleLoad">
            Načíst
          </UButton>
        </div>

        <div class="text-sm text-gray-500">
          <p class="font-medium mb-1">
            Kategorie:
          </p>
          <ul v-pre class="list-disc list-inside">
            <li>DH3+DH5: D3, H3, D5, H5, DI, HI, DII, HII</li>
            <li>DH7+DH9: D7, H7, D9, H9, DIII, HIII, DIV, HIV</li>
            <li>DS+HS: DS, HS, DV, HV</li>
          </ul>
        </div>

        <!-- Time slider -->
        <div v-if="runners.length > 0" class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Čas závodu:</label>
            <span class="text-sm font-mono">{{ sliderTimeLabel }}</span>
            <button v-if="!isLive" class="text-xs text-blue-600 underline" @click="resetToLive">
              Živě
            </button>
          </div>
          <input
            type="range"
            :min="minStartTime"
            :max="maxTime"
            :value="timeSliderValue"
            step="1000"
            class="w-full"
            @input="onSliderInput"
          >
        </div>
      </div>
    </section>

    <!-- Standings tables -->
    <div class="grid grid-cols-3 gap-0">
      <section v-for="gs in standings" v-show="gs.standings.length > 0" :key="gs.group.name" class="px-4 border-r last:border-r-0">
        <div class="flex items-center gap-3 mb-2">
          <h2 class="text-xl font-bold">
            {{ gs.group.name }}
          </h2>
          <UBadge variant="subtle">
            Max bodů: {{ gs.winPoints }}
          </UBadge>
        </div>

        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b text-left">
              <th class="py-2 px-2 w-10">
                #
              </th>
              <th class="py-2 px-2">
                Škola
              </th>
              <th class="py-2 px-2 w-16 text-right">
                Body
              </th>
              <th class="py-2 px-2 w-20 text-right">
                Čas
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(ts, idx) in gs.standings" :key="ts.team">
              <tr class="border-b hover:bg-gray-50">
                <td colspan="4" class="p-0">
                  <details :open="idx < 3">
                    <summary class="cursor-pointer py-2 px-2 flex">
                      <span class="w-10">{{ idx + 1 }}</span>
                      <span class="flex-1">{{ ts.team }}</span>
                      <span class="w-16 text-right">{{ ts.totalScore }}</span>
                      <span class="w-20 text-right">{{ Math.floor(ts.totalTime / 1000) }}s</span>
                    </summary>
                    <div class="pl-6 pb-3">
                      <table v-for="cs in ts.classScores" :key="cs.className" class="w-full text-xs mb-2">
                        <thead>
                          <tr class="text-gray-500">
                            <th class="text-left py-1">
                              {{ cs.className }}
                            </th>
                            <th class="text-right py-1">
                              Pozice
                            </th>
                            <th class="text-right py-1">
                              Body
                            </th>
                            <th class="text-right py-1">
                              Čas
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="sr in cs.runners" :key="sr.runner.id">
                            <td class="py-0.5">
                              {{ sr.runner.name }}
                            </td>
                            <td class="text-right">
                              {{ sr.position }}.
                            </td>
                            <td class="text-right">
                              {{ sr.score }}
                            </td>
                            <td class="text-right">
                              {{ formatTime(sr.time) }}
                            </td>
                          </tr>
                          <tr v-for="rr in getRunningRunners(cs.className, ts.team)" :key="rr.id" class="opacity-40">
                            <td class="py-0.5">
                              {{ rr.name }}
                            </td>
                            <td class="text-right">
                              –
                            </td>
                            <td class="text-right">
                              –
                            </td>
                            <td class="text-right">
                              {{ elapsedSince(rr.startTime!) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </details>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Per-class overview: top 2 -->
        <div v-if="classOverviews.get(gs.group.name)?.length" class="mt-4 text-xs space-y-2">
          <div v-for="co in classOverviews.get(gs.group.name)" :key="co.className">
            <span class="font-semibold">{{ co.className }}:</span>
            <span v-for="(r, i) in co.top" :key="r.id" class="ml-1">
              {{ i + 1 }}. {{ r.name }} ({{ r.club }}, {{ formatTime(r.finishTime! - r.startTime!) }}){{ i < co.top.length - 1 ? ',' : '' }}
            </span>
            <span v-if="co.running.length > 0" class="ml-1 opacity-40">
              ({{ co.running.length }} běží)
            </span>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <footer v-if="eventInfo" class="mt-8 pt-4 border-t text-sm text-gray-500">
      <p>{{ eventInfo.name }} &mdash; {{ eventInfo.date }}</p>
      <p>Výsledky jsou neoficiální a průběžné.</p>
    </footer>
  </div>
</template>
