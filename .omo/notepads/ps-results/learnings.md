## [2026-06-11] Task 1: Types
- All types exported from app/utils/psResults.ts
- OResultsResponse.deletedRunners: number[] confirmed in API
- DEFAULT_CATEGORY_GROUPS: 3 groups, source ceskyorientak.cz

## [2026-06-11] Task 2: Scoring Functions
- computePositions uses dense ranking (tied time = same position, next gets +1)
- computeClassScores: take top scoringFirst per team, equal positions get max score in group
- computeMostTeams: max distinct clubs with OK status per class, min 1
- computeGroupStandings: only scoring runners' times sum to totalTime

## [2026-06-11] Task 4: CORS + Fetch Wrapper
- CORS status: ALLOWED
- fetchOResults uses: direct fetch
- parseEventInput handles: numeric string, oresults.eu URL, cdn.oresults.eu URL
