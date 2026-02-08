import { useLocalStorage } from '@vueuse/core'
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

class GfxState {
  freetext: IFreeText | null = null
  liveFeed: ILiveFeed | null = null
  parameters: IParameters | null = null
  results: IResults | null = null
  singleRunner: ISingleRunner | null = null
  speaker: ISpeaker | null = null
  start: IStartDetail | null = null
  startlist: IStartList | null = null
  title: IRaceTitle | null = null
  weather: IWeather | null = null
  flowers: IFlowers | null = null
}

export function useGfxState() {
  const state = useLocalStorage('state-v1', () => new GfxState())

  const reset = () => {
    Object.assign(state.value, new GfxState())
  }

  const hideAll = () => {
    reset()
  }

  return {
    state,
    reset,
    hideAll
  }
}
