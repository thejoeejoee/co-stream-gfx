<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { IPsResultsTrigger } from '~/types/api.d'
import type { IResults } from '~/types/api.d'
import { fetchOResults } from '~/utils/psResults'
import { computeGroupStandings, computeMostTeams, DEFAULT_CATEGORY_GROUPS } from '~/utils/psResults'
import ResultsTable from './ResultsTable.vue'

const props = defineProps<{
  trigger: IPsResultsTrigger
}>()

const results = ref<IResults | null>(null)

onMounted(async () => {
  try {
    const response = await fetchOResults(props.trigger.eventId, 0)
    const group = DEFAULT_CATEGORY_GROUPS.find(g => g.name === props.trigger.group)
    if (!group) {
      console.error(`Unknown PS results group: ${props.trigger.group}`)
      return
    }

    const allClasses = DEFAULT_CATEGORY_GROUPS.flatMap(g => g.classes)
    const globalMostTeams = computeMostTeams(response.runners, allClasses)
    const globalWinPoints = globalMostTeams * 2

    const standings = computeGroupStandings(response.runners, group, 2, globalWinPoints)
    const page = props.trigger.page ?? 1
    const pageSize = 10
    const start = (page - 1) * pageSize
    const end = start + pageSize

    results.value = {
      label: props.trigger.final ? 'Konečné výsledky' : 'Průběžné výsledky',
      class: group.name,
      page: page,
      finish: props.trigger.final,
      is_national: true,
      is_relay: false,
      data: standings.standings.slice(start, end).map((team, idx) => ({
        position: String(start + idx + 1),
        name: team.team,
        nationality: 'CZE',
        club: '',
        time: `${team.totalScore} b.`,
        change: null
      }))
    }
  } catch (err) {
    console.error('Failed to fetch PS results:', err)
  }
})
</script>

<template>
  <ResultsTable
    v-if="results"
    :data="results"
  />
</template>
