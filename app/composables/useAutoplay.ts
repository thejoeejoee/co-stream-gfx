import { onUnmounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

import { eventSource, params } from '~/state'

const demos: Record<string, any> = import.meta.glob('../components/demo/*.json', {
  eager: true,
})

const demoKeys = Object.keys(demos)

const nameFromPath = (path: string) => {
  const filename = path.split('/').pop() ?? path
  return filename.split('.').slice(0, -1).join('.')
}

const hide = () => {
  eventSource.value?.dispatchEvent(new MessageEvent('hide'))
}

const fire = (f: string) => {
  const eventName = nameFromPath(f).split('.')[0] ?? nameFromPath(f)
  const payload = demos[f].default

  const e = new MessageEvent(
    eventName,
    { data: JSON.stringify(payload) },
  )
  eventSource.value?.dispatchEvent(e)
}

const SHOW_DURATION = 1500
const HIDE_DURATION = 200

export function useAutoplay() {
  const autoplay = params.has('autoplay')
  const show = params.get('show')

  let intervalId: number | undefined
  const autoPlayIndex = useLocalStorage('autoPlayIndex', 0)

  if (autoplay) {
    const demoKeysRandom = [...demoKeys].sort(() => Math.random() - 0.5)

    const loop = () => {
      if (autoPlayIndex.value >= demoKeys.length) {
        autoPlayIndex.value = 0
      }
      const f = demoKeysRandom[autoPlayIndex.value]
      if (!f) return
      fire(f)
      autoPlayIndex.value++

      window.setTimeout(() => {
        hide()
      }, SHOW_DURATION)
    }
    loop()
    intervalId = window.setInterval(loop, SHOW_DURATION + HIDE_DURATION)
  }
  else if (show) {
    const f = demoKeys.find(d => d.includes(show))
    if (f) {
      hide()
      fire(f)
    }
    else {
      console.warn(`No demo found for show: ${show}`)
    }
  }

  onUnmounted(() => {
    if (intervalId) {
      window.clearInterval(intervalId)
    }
  })

  return {
    autoplay,
    demoKeys,
    fire,
    hide,
    nameFromPath,
  }
}
