<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useOResultsPolling } from '~/composables/useOResultsPolling'
import { computeGroupStandings, DEFAULT_CATEGORY_GROUPS, parseEventInput } from '~/utils/psResults'
import type { CategoryGroup } from '~/utils/psResults'

const eventIdInput = ref('')
const eventId = ref<number | null>(null)
const intervalSeconds = ref(15)
const interval = computed(() => intervalSeconds.value * 1000)
const configOpen = ref(true)
const validationError = ref<string | null>(null)

const categoryGroups = ref<CategoryGroup[]>(DEFAULT_CATEGORY_GROUPS)

const { runners, eventInfo, isLoading, error, lastUpdate } = useOResultsPolling(eventId, interval)

const standings = computed(() =>
  categoryGroups.value.map(group => computeGroupStandings(runners.value, group))
)

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
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-3xl font-bold">
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
      </div>
    </section>

    <!-- Standings tables -->
    <section v-for="gs in standings" :key="gs.group.name" class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <h2 class="text-xl font-semibold">
          {{ gs.group.name }}
        </h2>
        <UBadge variant="subtle">
          Max bodů: {{ gs.winPoints }}
        </UBadge>
      </div>

      <p v-if="gs.standings.length === 0" class="text-gray-500 italic">
        Zatím žádné výsledky
      </p>

      <table v-else class="w-full text-sm border-collapse">
        <thead>
          <tr class="border-b text-left">
            <th class="py-2 px-2 w-16">
              Pořadí
            </th>
            <th class="py-2 px-2">
              Škola
            </th>
            <th class="py-2 px-2 w-20 text-right">
              Body
            </th>
            <th class="py-2 px-2 w-24 text-right">
              Čas
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(ts, idx) in gs.standings" :key="ts.team">
            <tr class="border-b hover:bg-gray-50">
              <td colspan="4" class="p-0">
                <details>
                  <summary class="cursor-pointer py-2 px-2 flex">
                    <span class="w-16">{{ idx + 1 }}</span>
                    <span class="flex-1">{{ ts.team }}</span>
                    <span class="w-20 text-right">{{ ts.totalScore }}</span>
                    <span class="w-24 text-right">{{ formatTime(ts.totalTime) }}</span>
                  </summary>
                  <div class="pl-8 pb-3">
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
                      </tbody>
                    </table>
                  </div>
                </details>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>

    <!-- Footer -->
    <footer v-if="eventInfo" class="mt-8 pt-4 border-t text-sm text-gray-500">
      <p>{{ eventInfo.name }} &mdash; {{ eventInfo.date }}</p>
      <p>Výsledky jsou neoficiální a průběžné.</p>
    </footer>
  </div>
</template>
