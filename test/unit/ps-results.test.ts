import { describe, expect, it } from 'vitest'
import {
  computeClassScores,
  computeGroupStandings,
  computeMostTeams,
  computePositions,
  parseEventInput,
  type OResultsRunner,
} from '../../app/utils/psResults'

function makeRunner(overrides: Partial<OResultsRunner>): OResultsRunner {
  return {
    id: 1,
    className: 'D3',
    startTime: 0,
    finishTime: 3600000,
    resultStatus: 'OK',
    name: 'Test Runner',
    club: 'Test School',
    changeId: 1,
    ...overrides,
  }
}

describe('parseEventInput', () => {
  it('parses a numeric event id', () => {
    expect(parseEventInput('308')).toBe(308)
  })

  it('parses an event id from url', () => {
    expect(parseEventInput('https://oresults.eu/events/308')).toBe(308)
  })

  it('returns null for garbage', () => {
    expect(parseEventInput('garbage')).toBeNull()
  })
})

describe('computePositions', () => {
  it('assigns positions by finish time', () => {
    const runners = [
      makeRunner({ id: 1, finishTime: 3000, name: 'A' }),
      makeRunner({ id: 2, finishTime: 1000, name: 'B' }),
      makeRunner({ id: 3, finishTime: 2000, name: 'C' }),
    ]

    expect(computePositions(runners, 'D3').map(r => r.position)).toEqual([1, 2, 3])
  })

  it('uses dense ranking for tied times', () => {
    const runners = [
      makeRunner({ id: 1, finishTime: 1000, name: 'A' }),
      makeRunner({ id: 2, finishTime: 1000, name: 'B' }),
      makeRunner({ id: 3, finishTime: 2000, name: 'C' }),
    ]

    expect(computePositions(runners, 'D3').map(r => r.position)).toEqual([1, 1, 2])
  })

  it('excludes non-OK results', () => {
    const runners = [
      makeRunner({ id: 1, finishTime: 1000, resultStatus: 'OK' }),
      makeRunner({ id: 2, finishTime: 2000, resultStatus: 'DNF' }),
    ]

    expect(computePositions(runners, 'D3')).toHaveLength(1)
  })

  it('excludes zero or null finish times', () => {
    const runners = [
      makeRunner({ id: 1, finishTime: 0 }),
      makeRunner({ id: 2, finishTime: null }),
      makeRunner({ id: 3, finishTime: 1000 }),
    ]

    expect(computePositions(runners, 'D3')).toHaveLength(1)
  })

  it('excludes empty clubs', () => {
    const runners = [
      makeRunner({ id: 1, club: '' }),
      makeRunner({ id: 2, club: 'Valid Club' }),
    ]

    expect(computePositions(runners, 'D3').map(r => r.runner.id)).toEqual([2])
  })
})

describe('computeClassScores', () => {
  it('scores teams by runner order', () => {
    const results = [
      { runner: makeRunner({ id: 1, club: 'Team A', name: 'A1' }), position: 1, time: 10 },
      { runner: makeRunner({ id: 2, club: 'Team A', name: 'A2' }), position: 2, time: 20 },
      { runner: makeRunner({ id: 3, club: 'Team B', name: 'B1' }), position: 3, time: 30 },
      { runner: makeRunner({ id: 4, club: 'Team B', name: 'B2' }), position: 4, time: 40 },
      { runner: makeRunner({ id: 5, club: 'Team C', name: 'C1' }), position: 5, time: 50 },
      { runner: makeRunner({ id: 6, club: 'Team C', name: 'C2' }), position: 6, time: 60 },
    ]

    const scores = computeClassScores(results, 2, 6)

    expect(scores.get('Team A')?.teamScore).toBe(11)
    expect(scores.get('Team B')?.teamScore).toBe(7)
    expect(scores.get('Team C')?.teamScore).toBe(3)
  })

  it('gives tied runners the max score of their position group', () => {
    const results = [
      { runner: makeRunner({ id: 1, club: 'Team A' }), position: 1, time: 10 },
      { runner: makeRunner({ id: 2, club: 'Team A' }), position: 1, time: 10 },
    ]

    const scores = computeClassScores(results, 2, 6)

    expect(scores.get('Team A')?.runners.map(r => r.score)).toEqual([6, 6])
    expect(scores.get('Team A')?.teamScore).toBe(12)
  })
})

describe('computeMostTeams', () => {
  it('counts distinct clubs across classes', () => {
    const runners = [
      makeRunner({ className: 'D3', club: 'Club A' }),
      makeRunner({ className: 'D3', club: 'Club B', id: 2 }),
      makeRunner({ className: 'D3', club: 'Club C', id: 3 }),
    ]

    expect(computeMostTeams(runners, ['D3', 'H3'])).toBe(3)
  })

  it('returns one for empty classes', () => {
    expect(computeMostTeams([], ['D3', 'H3'])).toBe(1)
  })
})

describe('computeGroupStandings', () => {
  it('sorts standings by score then total time', () => {
    const group = { name: 'Test Group', classes: ['D3', 'H3'] }
    const runners = [
      makeRunner({ id: 1, className: 'D3', club: 'Team A', finishTime: 1000, startTime: 0 }),
      makeRunner({ id: 2, className: 'D3', club: 'Team B', finishTime: 2000, startTime: 0 }),
      makeRunner({ id: 3, className: 'D3', club: 'Team C', finishTime: 3000, startTime: 0 }),
      makeRunner({ id: 4, className: 'H3', club: 'Team A', finishTime: 1500, startTime: 0 }),
      makeRunner({ id: 5, className: 'H3', club: 'Team B', finishTime: 2500, startTime: 0 }),
      makeRunner({ id: 6, className: 'H3', club: 'Team C', finishTime: 3500, startTime: 0 }),
    ]

    const standings = computeGroupStandings(runners, group, 2)

    expect(standings.mostTeams).toBe(3)
    expect(standings.winPoints).toBe(6)
    expect(standings.standings.map(s => s.team)).toEqual(['Team A', 'Team B', 'Team C'])
    expect(standings.standings[0]?.totalScore).toBe(12)
    expect(standings.standings[0]?.totalTime).toBeLessThan(standings.standings[1]!.totalTime)
  })

  it('returns empty standings when all runners are DNF', () => {
    const group = { name: 'Test Group', classes: ['D3', 'H3'] }
    const runners = [
      makeRunner({ id: 1, className: 'D3', resultStatus: 'DNF' }),
      makeRunner({ id: 2, className: 'H3', resultStatus: 'DNF' }),
    ]

    expect(computeGroupStandings(runners, group).standings).toEqual([])
  })
})
