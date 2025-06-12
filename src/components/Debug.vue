<template>
  <div v-if="isDebug" class="
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
  ">

    <div v-if="autoplay" class="text-md">autoplay enabled</div>

    <div class="flex flex-row gap-16 flex-wrap justify-center pt-8" v-if="!autoplay">
      <button
          class="text-md font-semibold mx-auto"
          @click="hide"
      >hide all</button>
      <button
          class="text-md font-semibold mx-auto"
          @click="openFileModal()"
      >import file</button>

      <a href="?autoplay" class="text-md font-semibold mx-auto">autoplay</a>

    </div>

    <div class="flex flex-row gap-4 flex-wrap justify-center pt-8" v-if="!autoplay">
      <button
          v-for="path in demoKeys"
          @click="fire(path)"
          v-text="nameFromPath(path)"
      ></button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import {onKeyStroke, useLocalStorage} from "@vueuse/core";

import { useFileDialog } from '@vueuse/core'

const { files, open: openFileModal, reset, onCancel, onChange } = useFileDialog({
  accept: '.json',
  multiple: false,
})

onChange(async () => {
  const f = files.value?.item(0)
  if (!f) return

  const r = new FileReader()
  r.onload = () => {
    try {
      const data = JSON.parse(r.result as string)
      const eventName = nameFromPath(f.name).split('.')[0]
      const e = new MessageEvent(
        eventName,
        {data: JSON.stringify(data)}
      )
      props.eventSource.dispatchEvent(e)
    } catch (error) {
      alert("Error parsing JSON file. Please ensure it is valid JSON.")
      console.error("Error parsing JSON file:", error)
    }
  }
  r.readAsText(f)
})


const props = defineProps<{
  eventSource: EventSource
}>()

const params = new URLSearchParams(window.location.search)
const isDebug = params.has('debug')
const autoplay = params.has('autoplay')

const demos: Record<string, any> = import.meta.glob("./demo/*.json", {
  eager: true,
})

const demoKeys = Object.keys(demos)

const nameFromPath = (path: string) => {
  // get the filename from the path
  const parts = path.split('/')
  const filename = parts[parts.length - 1]
  // remove the file extension (anything after the last dot)
  return filename.split(".").slice(0, -1).join(".")
}

const hide = () => {
  props.eventSource.dispatchEvent(new MessageEvent('hide'))
}

const fire = (f: string) => {
  // first part before dot is the event name
  const eventName = nameFromPath(f).split('.')[0]
  const payload = demos[f].default

  const e = new MessageEvent(
      eventName,
    {data: JSON.stringify(payload)}
  )
  console.log("Firing event", eventName)
  props.eventSource.dispatchEvent(e)
}

// TODO: receive event stream and send demo data

const showDuration = 1500
const hideDuration = 200

let id: number | undefined = undefined
let i = useLocalStorage("autoPlayIndex", 0)

if (autoplay) {
  const loop = () => {
    if (i.value >= demoKeys.length) {
      i.value = 0
    }
    const f = demoKeys[i.value]
    fire(f)
    i.value++

    window.setTimeout(() => {
      hide()
    }, showDuration)
  }
  loop()
  id = window.setInterval(loop, showDuration + hideDuration)
}
onUnmounted(() => {
  if (autoplay && id) {
    window.clearInterval(id)
  }
})

</script>