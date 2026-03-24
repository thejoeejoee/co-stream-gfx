import { onUnmounted, ref } from 'vue'
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

const fire = async (path: string) => {
  const name = nameFromPath(path)
  const eventName = name.split('.')[0] || name
  const payload = await loadDemo(path)
  if (!payload) return

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

  let intervalId: number | undefined
  let timeoutIds: number[] = []
  const autoPlayIndex = useLocalStorage('autoPlayIndex', 0)

  const init = async () => {
    demoKeys.value = Object.keys(demoModules)

    if (autoplay) {
      const demoKeysRandom = [...demoKeys.value].sort(() => Math.random() - 0.5)

      const loop = async () => {
        if (autoPlayIndex.value >= demoKeys.value.length) {
          autoPlayIndex.value = 0
        }
        const f = demoKeysRandom[autoPlayIndex.value]
        if (!f) return
        await fire(f)
        autoPlayIndex.value++

        const tid = window.setTimeout(() => {
          hide()
        }, SHOW_DURATION)
        timeoutIds.push(tid)
      }
      await loop()
      intervalId = window.setInterval(loop, SHOW_DURATION + HIDE_DURATION)
    }
    else if (show) {
      const f = demoKeys.value.find(d => d.includes(show))
      if (f) {
        hide()
        await fire(f)
      }
      else {
        console.warn(`No demo found for show: ${show}`)
      }
    }
  }

  init()

  onUnmounted(() => {
    if (intervalId) {
      window.clearInterval(intervalId)
    }
    for (const tid of timeoutIds) {
      window.clearTimeout(tid)
    }
    timeoutIds = []
  })

  return {
    autoplay,
    demoKeys,
    fire,
    hide,
    nameFromPath
  }
}
