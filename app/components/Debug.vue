<template>
  <div>
    <GfxMain class="GfxScreen--debug" />

    <div
      class="
      max-w-[70vw] mx-auto
      p-4 flex flex-col gap-4 items-center

      [&_button]:p-2
      [&_button]:bg-amber-100
      [&_button]:border-amber-400
      [&_button]:border
      [&_button]:uppercase
      [&_button]:font-semibold
      [&_button]:cursor-pointer
      [&_a]:p-2

      [&_a]:bg-amber-100
      [&_a]:border-amber-400
      [&_a]:border
      [&_a]:uppercase
      [&_a]:font-semibold
      [&_a]:cursor-pointer
    "
    >
      <div
        v-if="autoplay"
        class="text-md"
      >
        autoplay enabled
      </div>

      <div
        v-if="!autoplay"
        class="flex flex-row gap-16 flex-wrap justify-center pt-8"
      >
        <button
          class="text-md font-semibold mx-auto"
          @click="hide"
        >
          hide all
        </button>
        <button
          class="text-md font-semibold mx-auto"
          @click="openFileModal()"
        >
          import file
        </button>

        <a
          href="?autoplay"
          class="text-md font-semibold mx-auto"
        >autoplay</a>
      </div>

      <div
        v-if="!autoplay"
        class="flex flex-row gap-4 flex-wrap justify-center pt-8"
      >
        <button
          v-for="path in demoKeys"
          @click="fire(path)"
          v-text="nameFromPath(path)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'

import GfxMain from './gfx/Main.vue'
import { eventSource } from '~/state'
import { useAutoplay } from '~/composables/useAutoplay'

const { autoplay, demoKeys, fire, hide, nameFromPath } = useAutoplay()

const { files, open: openFileModal, onChange } = useFileDialog({
  accept: '.json',
  multiple: false
})

onChange(async () => {
  const f = files.value?.item(0)
  if (!f) return

  const r = new FileReader()
  r.onload = () => {
    try {
      const data = JSON.parse(r.result as string)
      const eventName: string = nameFromPath(f.name).split('.')[0] ?? nameFromPath(f.name)
      const e = new MessageEvent(
        eventName,
        { data: JSON.stringify(data) }
      )
      eventSource.value?.dispatchEvent(e)
    } catch (error) {
      alert('Error parsing JSON file. Please ensure it is valid JSON.')
      console.error('Error parsing JSON file:', error)
    }
  }
  r.readAsText(f)
})
</script>
