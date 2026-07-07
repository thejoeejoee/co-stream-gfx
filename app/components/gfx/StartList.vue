<template>
  <div class="StartList rounded-[var(--gfx-radius)] overflow-hidden">
    <div class="StartList__Title Animate__Slide">
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
        class="mr-auto"
        v-text="data.label"
      />
      <span v-text="data.class" />
      <!--      <span class="Gfx__Control Gfx__Control&#45;&#45;finish"><span></span></span> -->
    </div>

    <!--    <div class="StartList__Grid StartList__Grid&#45;&#45;expand StartList__Grid&#45;&#45;no-left-margin" tag="div" name="list"> -->
    <TransitionGroup
      name="StartList"
      tag="div"
      class="Animate__Clip"
    >
      <div
        :key="data.page.toString()+data.data[0]?.name"
        class="StartList__Grid StartList__Grid--expand StartList__Grid--no-empty-gutter-margin"
        :class="{ 'StartList__Grid--bib-highlight': isIOF }"
      >
        <template
          v-for="(row, index) in data.data"
          :key="row.name"
        >
          <template
            v-if="row.name"
          >
            <span
              class="StartList__Position"
              v-text="row.bib_number"
            />
            <span
              class="StartList__Name"
              v-text="isIOF ? stripAccents(row.name) : row.name"
            />
            <club-flag
              :conf="data"
              :item="row"
            />
            <span
              class="StartList__Time"
              v-text="row.start_time"
            />

            <div class="StartList__Divider" />
          </template>
        </template>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { IStartList } from '~/types/api.d'
import CoSymbol from '../../assets/co_symbol.svg?component'
import ClubFlag from './../ClubFlag.vue'
import { useTheme } from '~/composables/useTheme'
import { stripAccents } from '~/utils/text'
import iofLogoUrl from '~/assets/iof-logo-colour-withouttext.png'

const { isIOF } = useTheme()

defineProps<{
  data: IStartList
}>()
</script>
