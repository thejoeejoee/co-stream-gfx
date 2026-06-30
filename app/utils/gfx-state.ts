import type {
  IFlowers,
  IFreeText,
  ILiveFeed,
  IParameters,
  IPsResultsTrigger,
  IRaceTitle,
  IResults,
  IRunnerSplits,
  ISingleRunner,
  ISpeaker,
  IStartDetail,
  IStartGroup,
  IStartList,
  ITimer,
  IWeather
} from '~/types/api.d'

export interface GfxState {
  freetext: IFreeText | null
  liveFeed: ILiveFeed | null
  parameters: IParameters | null
  psResults: IPsResultsTrigger | null
  results: IResults | null
  runnerSplits: IRunnerSplits | null
  singleRunner: ISingleRunner | null
  speaker: ISpeaker | null
  start: IStartDetail | null
  startGroup: IStartGroup | null
  startlist: IStartList | null
  timer: ITimer | null
  title: IRaceTitle | null
  weather: IWeather | null
  flowers: IFlowers | null
}

export function createDefaultState(): GfxState {
  return {
    freetext: null,
    liveFeed: null,
    parameters: null,
    psResults: null,
    results: null,
    runnerSplits: null,
    singleRunner: null,
    speaker: null,
    start: null,
    startGroup: null,
    startlist: null,
    timer: null,
    title: null,
    weather: null,
    flowers: null
  }
}

/** SSE event name → GfxState key mapping */
export const eventMap: Record<string, keyof GfxState> = {
  'freetext': 'freetext',
  'params': 'parameters',
  'live-feed': 'liveFeed',
  'title': 'title',
  'speaker': 'speaker',
  'weather': 'weather',
  'startlist': 'startlist',
  'single-runner': 'singleRunner',
  'start': 'start',
  'start-group': 'startGroup',
  'results': 'results',
  'ps-results': 'psResults',
  'flowers': 'flowers',
  'timer': 'timer',
  'runner-splits': 'runnerSplits'
}

/** SSE events that hide a specific state key */
export const hideEvents: Record<string, keyof GfxState> = {
  'hide-timer': 'timer'
}

/** Mutually exclusive pairs: receiving one clears the others */
export const exclusions: Partial<Record<keyof GfxState, (keyof GfxState)[]>> = {
  liveFeed: ['singleRunner', 'start', 'startGroup', 'speaker', 'freetext', 'title', 'flowers'],
  singleRunner: ['liveFeed', 'start', 'startGroup', 'speaker', 'freetext', 'title', 'flowers'],
  start: ['liveFeed', 'singleRunner', 'startGroup', 'speaker', 'freetext', 'title', 'flowers'],
  startGroup: ['liveFeed', 'singleRunner', 'start', 'speaker', 'freetext', 'title', 'flowers'],
  speaker: ['liveFeed', 'singleRunner', 'start', 'startGroup', 'freetext', 'title', 'flowers'],
  freetext: ['liveFeed', 'singleRunner', 'start', 'startGroup', 'speaker', 'title', 'flowers'],
  title: ['liveFeed', 'singleRunner', 'start', 'startGroup', 'speaker', 'freetext', 'flowers', 'weather', 'parameters', 'runnerSplits'],
  flowers: ['liveFeed', 'singleRunner', 'start', 'startGroup', 'speaker', 'freetext', 'title', 'parameters', 'weather', 'runnerSplits'],
  results: ['startlist', 'psResults'],
  psResults: ['results', 'startlist'],
  startlist: ['results', 'psResults'],
  weather: ['parameters', 'flowers', 'title', 'runnerSplits'],
  parameters: ['weather', 'flowers', 'title', 'runnerSplits'],
  runnerSplits: ['weather', 'parameters', 'flowers', 'title']
}
