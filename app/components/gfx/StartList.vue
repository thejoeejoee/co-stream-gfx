<template>
  <div class="Table rounded-[var(--gfx-radius)] overflow-hidden">
    <div class="Table__Title Animate__Slide">
      <co-symbol v-if="!isIOF" class="fill-gfx-primary h-[var(--text-lg--line-height)]" />
      <span
        class="mr-auto"
        v-text="data.label"
      />
      <span v-text="data.class" />
      <!--      <span class="Gfx__Control Gfx__Control&#45;&#45;finish"><span></span></span> -->
    </div>

    <!--    <div class="Table__Grid Table__Grid&#45;&#45;expand Table__Grid&#45;&#45;no-left-margin" tag="div" name="list"> -->
    <TransitionGroup
      name="table"
      tag="div"
      class="Animate__Clip"
    >
      <div
        :key="data.page.toString()+data.data[0]?.name"
        class="Table__Grid Table__Grid--expand Table__Grid--no-empty-gutter-margin Table__Grid--bib-highlight"
      >
        <template
          v-for="(row, index) in data.data"
          :key="row.name"
        >
          <template
            v-if="row.name"
          >
            <span
              class="Table__Position"
              v-text="row.bib_number"
            />
            <span
              class="Table__Name"
              v-text="stripAccents(row.name)"
            />
            <club-flag
              :conf="data"
              :item="row"
            />
            <span
              class="Table__Time"
              v-text="row.start_time"
            />

            <div class="Table__Divider" />
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

const { isIOF } = useTheme()

defineProps<{
  data: IStartList
}>()
</script>
