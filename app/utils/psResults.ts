export interface OResultsRunner {
  id: number
  className: string
  startTime: number | null
  finishTime: number | null
  resultStatus: string | null
  name: string
  club: string
  changeId: number
}

export interface OResultsClass {
  id: number
  name: string
  changeId: number
}

export interface OResultsEvent {
  id: number
  name: string
  date: string
}

export interface OResultsResponse {
  event: OResultsEvent
  runners: OResultsRunner[]
  classes: OResultsClass[]
  lastChangeId: number
  deletedRunners: number[]
}

export interface CategoryGroup {
  name: string
  classes: string[]
}

export interface RunnerResult {
  runner: OResultsRunner
  position: number
  time: number
}

export interface ScoredRunner {
  runner: OResultsRunner
  position: number
  time: number
  score: number
}

export interface ClassTeamScore {
  className: string
  runners: ScoredRunner[]
  teamScore: number
}

export interface TeamScore {
  team: string
  totalScore: number
  totalTime: number
  classScores: ClassTeamScore[]
}

export interface GroupStandings {
  group: CategoryGroup
  standings: TeamScore[]
  mostTeams: number
  winPoints: number
}

export const DEFAULT_CATEGORY_GROUPS: CategoryGroup[] = [
  { name: 'DH3+DH5', classes: ['D3', 'H3', 'D5', 'H5', 'DI', 'HI', 'DII', 'HII'] },
  { name: 'DH7+DH9', classes: ['D7', 'H7', 'D9', 'H9', 'DIII', 'HIII', 'DIV', 'HIV'] },
  { name: 'DS+HS', classes: ['DS', 'HS', 'DV', 'HV'] }
]

export function parseEventInput(input: string): number | null {
  const trimmed = input.trim()
  const num = Number(trimmed)
  if (!Number.isNaN(num) && num > 0) return num

  const match = trimmed.match(/\/events\/(\d+)/)
  if (match) return Number(match[1])

  return null
}

export async function fetchOResults(eventId: number, since = 0): Promise<OResultsResponse> {
  const url = `https://cdn.oresults.eu/events/${eventId}/changes?since=${since}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`OResults API error: ${response.status}`)
  }

  return response.json() as Promise<OResultsResponse>
}

export function computePositions(runners: OResultsRunner[], className: string): RunnerResult[] {
  const filtered = runners.filter(
    r =>
      r.className === className &&
      r.resultStatus === 'OK' &&
      r.finishTime !== null &&
      r.finishTime !== 0 &&
      r.startTime !== null &&
      r.club !== ''
  )

  const withTime = filtered.map(r => ({
    runner: r,
    time: r.finishTime! - r.startTime!
  }))

  withTime.sort((a, b) => a.time - b.time)

  const results: RunnerResult[] = []
  let position = 1
  for (let i = 0; i < withTime.length; i++) {
    const current = withTime[i]!
    const previous = withTime[i - 1]
    if (i > 0 && current.time !== previous!.time) {
      position++
    }
    results.push({ runner: current.runner, position, time: current.time })
  }

  return results
}

export function computeClassScores(
  results: RunnerResult[],
  scoringFirst: number,
  winPoints: number
): Map<string, ClassTeamScore> {
  const byTeam = new Map<string, RunnerResult[]>()
  for (const r of results) {
    const team = r.runner.club
    if (!byTeam.has(team)) byTeam.set(team, [])
    byTeam.get(team)!.push(r)
  }

  const selectedByTeam = new Map<string, RunnerResult[]>()
  for (const [team, teamResults] of byTeam) {
    const sorted = [...teamResults].sort((a, b) => a.position - b.position)
    selectedByTeam.set(team, sorted.slice(0, scoringFirst))
  }

  const allSelected: Array<{ team: string; result: RunnerResult }> = []
  for (const [team, selected] of selectedByTeam) {
    for (const r of selected) {
      allSelected.push({ team, result: r })
    }
  }
  allSelected.sort((a, b) => a.result.position - b.result.position)

  const withPrelim = allSelected.map((entry, idx) => ({
    ...entry,
    score: Math.max(0, winPoints - idx)
  }))

  const positionGroups = new Map<number, typeof withPrelim>()
  for (const entry of withPrelim) {
    const pos = entry.result.position
    if (!positionGroups.has(pos)) positionGroups.set(pos, [])
    positionGroups.get(pos)!.push(entry)
  }

  const teamScoredRunners = new Map<string, ScoredRunner[]>()
  for (const group of positionGroups.values()) {
    const maxScore = Math.max(...group.map(e => e.score))
    for (const entry of group) {
      if (!teamScoredRunners.has(entry.team)) teamScoredRunners.set(entry.team, [])
      teamScoredRunners.get(entry.team)!.push({
        runner: entry.result.runner,
        position: entry.result.position,
        time: entry.result.time,
        score: maxScore
      })
    }
  }

  const scores = new Map<string, ClassTeamScore>()
  for (const [team, scoredRunners] of teamScoredRunners) {
    scores.set(team, {
      className: scoredRunners[0]?.runner.className ?? '',
      runners: scoredRunners,
      teamScore: scoredRunners.reduce((sum, r) => sum + r.score, 0)
    })
  }

  return scores
}

export function computeMostTeams(allRunners: OResultsRunner[], classes: string[]): number {
  let max = 0

  for (const cls of classes) {
    if (!cls.startsWith('D') && !cls.startsWith('H')) continue

    const clubs = new Set<string>()
    for (const r of allRunners) {
      if (r.className === cls && r.resultStatus === 'OK' && r.club !== '') {
        clubs.add(r.club)
      }
    }
    if (clubs.size > max) max = clubs.size
  }

  return max < 1 ? 1 : max
}

export function computeGroupStandings(
  runners: OResultsRunner[],
  group: CategoryGroup,
  scoringFirst: number = 2
): GroupStandings {
  const mostTeams = computeMostTeams(runners, group.classes)
  const winPoints = mostTeams * scoringFirst

  const teamAgg = new Map<string, { totalScore: number; totalTime: number; classScores: ClassTeamScore[] }>()

  for (const cls of group.classes) {
    const positions = computePositions(runners, cls)
    const classScores = computeClassScores(positions, scoringFirst, winPoints)

    for (const [team, cs] of classScores) {
      if (!teamAgg.has(team)) {
        teamAgg.set(team, { totalScore: 0, totalTime: 0, classScores: [] })
      }
      const agg = teamAgg.get(team)!
      agg.totalScore += cs.teamScore
      agg.totalTime += cs.runners.reduce((sum, r) => sum + r.time, 0)
      agg.classScores.push(cs)
    }
  }

  const standings: TeamScore[] = []
  for (const [team, agg] of teamAgg) {
    standings.push({
      team,
      totalScore: agg.totalScore,
      totalTime: agg.totalTime,
      classScores: agg.classScores
    })
  }

  standings.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore
    return a.totalTime - b.totalTime
  })

  return { group, standings, mostTeams, winPoints }
}
