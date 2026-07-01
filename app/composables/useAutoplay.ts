import { onMounted, onUnmounted, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

import { eventSource, params } from '~/state'

const demoModules = import.meta.glob('../components/demo/*.json')

const nameFromPath = (path: string) => {
  const filename = path.split('/').pop() ?? path
  return filename.split('.').slice(0, -1).join('.')
}

const hide = () => {
  eventSource.value?.dispatchEvent(new MessageEvent('hide'))
}

const loadDemo = async (path: string) => {
  const loader = demoModules[path]
  if (!loader) return undefined
  const mod = await loader() as { default: unknown }
  return mod.default
}

const isIOF = params.get('theme') === 'iof'

const applyInternationalMode = (payload: unknown): unknown => {
  if (typeof payload !== 'object' || payload === null) return payload
  const data = payload as Record<string, unknown>
  if ('is_national' in data) {
    return { ...data, is_national: false }
  }
  return data
}

const fire = async (path: string) => {
  const name = nameFromPath(path)
  const eventName = name.split('.')[0] || name
  let payload = await loadDemo(path)
  if (!payload) return

  if (isIOF) {
    payload = applyInternationalMode(payload)
  }

  const e = new MessageEvent(
    eventName,
    { data: JSON.stringify(payload) }
  )
  eventSource.value?.dispatchEvent(e)
}

const SHOW_DURATION = 1500
const HIDE_DURATION = 200

export function useAutoplay() {
  const autoplay = params.has('autoplay')
  const show = params.get('show')
  const demoKeys = ref<string[]>([])

  let loopTimeoutId: number | undefined
  let hideTimeoutId: number | undefined
  let stopped = false
  const autoPlayIndex = useLocalStorage('autoPlayIndex', 0)

  const init = async () => {
    demoKeys.value = Object.keys(demoModules)

    if (autoplay) {
      const demoKeysRandom = [...demoKeys.value].sort(() => Math.random() - 0.5)

      const loop = async () => {
        if (stopped) return
        if (autoPlayIndex.value >= demoKeys.value.length) {
          autoPlayIndex.value = 0
        }
        const f = demoKeysRandom[autoPlayIndex.value]
        if (!f) return
        await fire(f)
        autoPlayIndex.value++

        hideTimeoutId = window.setTimeout(() => {
          hide()
        }, SHOW_DURATION)

        loopTimeoutId = window.setTimeout(loop, SHOW_DURATION + HIDE_DURATION)
      }
      await loop()
    }
    else if (show) {
      const f = demoKeys.value.find(d => d.includes(show))
      if (f) {
        hide()
        const delaySec = Number(params.get('delay'))
        const delayMs = Number.isFinite(delaySec) && delaySec > 0 ? delaySec * 1000 : 0
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs))
          if (stopped) return
        }
        await fire(f)
      }
      else {
        console.warn(`No demo found for show: ${show}`)
      }
    }
  }

  onMounted(() => {
    void init().catch((error) => {
      console.error('Failed to initialize autoplay', error)
    })
  })

  onUnmounted(() => {
    stopped = true
    if (loopTimeoutId) {
      window.clearTimeout(loopTimeoutId)
    }
    if (hideTimeoutId) {
      window.clearTimeout(hideTimeoutId)
    }
  })

  return {
    autoplay,
    demoKeys,
    fire,
    hide,
    nameFromPath
  }
}
