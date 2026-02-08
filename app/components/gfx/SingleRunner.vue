<template>
  <Transition
    name="nested-slide"
    appear
  >
    <div
      v-if="singleRunner !== null"
      class="h-36 flex-col"
    >
      <div
        class="
          flex flex-row items-center justify-between
          text-lg
          Animate__Slide
          rounded-t-[var(--border-radius)] overflow-hidden
        "
        style="background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur))"
      >
        <span
          v-if="singleRunner.bib_number"
          class="
            flex items-center px-6
            h-24 font-semibold
            gradient-animated
          "
          style="
            background: linear-gradient(135deg, var(--color-co-orange) 0%, var(--color-co-orange-dark) 100%);
            background-size: 200% 200%;
            color: var(--color-co-beige);
          "
          v-text="singleRunner.bib_number"
        />
        <AnimatedText
          variant="title"
          class="
            h-24 px-6 w-full
            flex flex-row justify-between items-center
            uppercase text-co-black
          "
          :class="{ 'border-l-[calc(var(--spacing)*2)]': !singleRunner.bib_number }"
          style="column-gap: 1rem; border-color: var(--color-co-orange)"
        >
          {{ singleRunner.name }}

          <club-flag
            :conf="singleRunner"
            :item="singleRunner"
            club-class="text-co-orange"
          />
        </AnimatedText>
      </div>

      <h2
        class="
          font-co text-md h-12 flex items-center justify-between
          p-4
          rounded-b-[var(--border-radius)]
          Animate__Clip
        "
        style="
          column-gap: 1rem;
          background: linear-gradient(135deg, var(--color-co-orange) 0%, var(--color-co-orange-dark) 100%);
          color: var(--color-co-beige);
          box-shadow: var(--shadow-md);
        "
      >
        <span
          class="italic font-semibold"
          v-text="singleRunner.class"
        />
        <span v-text="singleRunner.detail" />
      </h2>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { ISingleRunner } from '~/types/api.d'
import ClubFlag from './../ClubFlag.vue'
import AnimatedText from '~/components/core/AnimatedText.vue'

defineProps<{
  singleRunner: ISingleRunner
}>()
</script>

