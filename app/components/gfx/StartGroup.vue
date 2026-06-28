<template>
  <div class="Table rounded-[var(--gfx-radius)] overflow-hidden">
    <div class="Table__Title Animate__Slide">
      <co-symbol v-if="!isIOF" class="fill-gfx-primary h-[var(--text-lg--line-height)]" />
      <span
        v-else
        class="inline-block h-[var(--text-lg--line-height)] bg-white pr-4"
        :style="{
          aspectRatio: '1000 / 404',
          maskImage: `url(${iofLogoUrl})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
        }"
      />
      <span
        class="ml-auto"
        v-text="data.start_time"
      />
    </div>

    <div class="Table__Grid Table__Grid--expand Table__Grid--no-empty-gutter-margin Animate__Clip">
      <template
        v-for="(row, index) in data.data"
        :key="row.name"
      >
        <span
          class="Table__Position"
          v-text="row.bib_number"
        />
        <span
          class="Table__Name"
          v-text="isIOF ? stripAccents(row.name) : row.name"
        />
        <club-flag
          :conf="data"
          :item="row"
        />
        <span
          class="Table__Time"
          v-text="row.class"
        />

        <div
          v-if="index < data.data.length - 1"
          class="Table__Divider"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IStartGroup } from '~/types/api.d'
import CoSymbol from '../../assets/co_symbol.svg?component'
import ClubFlag from './../ClubFlag.vue'
import { useTheme } from '~/composables/useTheme'
import { stripAccents } from '~/utils/text'
import iofLogoUrl from '~/assets/iof-logo-colour-withouttext.png'

const { isIOF } = useTheme()

defineProps<{
  data: IStartGroup
}>()
</script>
