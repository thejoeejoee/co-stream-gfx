<template>
  <div class="
    h-36 flex-col

    rounded-md overflow-hidden
  " v-if="singleRunner !== null">
    <div class="
      flex flex-row items-center justify-between
      text-lg bg-white
      Animate__Slide
    ">
      <span
          v-if="singleRunner.bib_number"
          class="
          flex items-center px-6
          bg-co-orange  text-co-beige
          h-24 font-semibold
        "
          v-text="singleRunner.bib_number"
      />
      <h1
        class="
          h-24 bg-white px-6 gap-x-4 w-full
          flex flex-row justify-between items-center
          font-co uppercase text-co-black
        "
        :class="{'border-l-[calc(var(--spacing)*2)] border-l-co-orange': !singleRunner.bib_number}">
        {{ singleRunner.name }}

        <club-flag
            :conf="singleRunner"
            :item="singleRunner"
            club-class="text-co-orange"
        />
      </h1>
    </div>

    <h2 class="
      font-co text-md h-12 flex items-center justify-between gap-x-4
      p-4
      bg-co-orange text-co-beige
      Animate__Clip
    ">
      <span v-text="singleRunner.class" class="italic font-semibold"/>
      <span v-text="singleRunner.detail"></span>
    </h2>

  </div>
</template>
<script setup lang="ts">
import type {ISingleRunner} from "@/types/api";
import ClubFlag from "@/components/ClubFlag.vue";

defineProps<{
  singleRunner: ISingleRunner
}>()
</script>