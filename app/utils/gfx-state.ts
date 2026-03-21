import type {
  IFlowers,
  IFreeText,
  ILiveFeed,
  IParameters,
  IRaceTitle,
  IResults,
  ISingleRunner,
  ISpeaker,
  IStartDetail,
  IStartList,
  IWeather
} from '~/types/api.d'

export interface GfxState {
  freetext: IFreeText | null
  liveFeed: ILiveFeed | null
  parameters: IParameters | null
  results: IResults | null
  singleRunner: ISingleRunner | null
  speaker: ISpeaker | null
  start: IStartDetail | null
  startlist: IStartList | null
  title: IRaceTitle | null
  weather: IWeather | null
  flowers: IFlowers | null
}

export function createDefaultState(): GfxState {
  return {
    freetext: null,
    liveFeed: null,
    parameters: null,
    results: null,
    singleRunner: null,
    speaker: null,
    start: null,
    startlist: null,
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
  'results': 'results',
  'flowers': 'flowers'
}

/** Mutually exclusive pairs: receiving one clears the other */
export const exclusions: Partial<Record<keyof GfxState, keyof GfxState>> = {
  singleRunner: 'start',
  start: 'singleRunner'
}
