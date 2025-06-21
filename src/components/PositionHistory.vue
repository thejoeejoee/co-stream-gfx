<script setup lang="ts">
import {computed, ref} from "vue";
// import "vue-data-ui/style.css"; // If you are using multiple components, place styles import in your main

import Text from "@/components/Text.vue";

import ApexCharts from 'vue3-apexcharts'
import lo from 'lodash'
import type {Ref} from "vue";
import type {ApexOptions} from "apexcharts";
import history from "./demo/position-history.01.json"
import type {IPositionHistory, IPositionHistoryEntry, IPositionHistoryRunner} from "@/types/api";
import {onKeyStroke} from "@vueuse/core";

let data: IPositionHistory = history as IPositionHistory

const shownControls = ref(history.controls.length)

const series = computed(() => {
  return data.data.map((v: IPositionHistoryRunner) => {
    return {
      name: v.name,
      data: v.history.map((d: IPositionHistoryEntry, controlIdx: number) => {
        return {
          x: data.controls[controlIdx],
          // show only if controlIdx <= i.value + for first control show the finish position
          y: controlIdx < shownControls.value ? (d.position != 0 ? d.position : lo.last(v.history)?.position) : null,
        }
      }),
    }
  })
})

const chartOptions: Ref<ApexOptions> = ref({
  chart: {
    type: 'line',
    sparkline: {
      enabled: true,
    },
    animations: {
      enabled: true,
      animateGradually: {
        enabled: false,
        delay: 150,
      },
      dynamicAnimation: {
        speed: 500
      },
    }
  },
  theme: {
    palette: "pallette3",
  },
  plotOptions: {
    line: {
      isSlopeChart: true,
    },
  },
  grid: {
    show: false,
  },
  tooltip: {
    enabled: false,
  },
  dataLabels: {
    enabled: true,
    // distributed: true,
    background: {
      enabled: true,
      padding: 8
    },
    style: {
      fontSize: "20px",
      fontFamily: "GTPlanar",
    },
    formatter(val, opts) {
      if (opts.dataPointIndex != 0 && opts.dataPointIndex != /*shownControls.value*/data.controls.length - 1) {
        return val
        return ""
      }
      const seriesName = opts.w.config.series[opts.seriesIndex].name
      const v = val !== null ? seriesName : ''
      return v.length > 12 ? v.split(" ") : v
    },
  },
  yaxis: {
    show: true,
    reversed: true,
    // prepare range to avoid shifting
    min: 0,
    max: Math.max(...data.data.map((v: IPositionHistoryRunner) => {
      return Math.max(...v.history.map((d: IPositionHistoryEntry) => d.position))
    })),
    labels: {
      show: true,
      style: {
        cssClass: "text-co-orange"
      }
    },
  },
  xaxis: {
    position: 'bottom',
    categories: data.controls,
    axisBorder: {
      show: false,
    },
    labels: {
      style: {
        fontFamily: 'GTPlanar',
        fontSize: '20px',
      },

    }
  },
  legend: {
    show: false,
  },
  stroke: {
    // width: [2, 3, 4, 1],
    dashArray: [0, 2, 4, 8],
    curve: 'smooth',
  }
} as ApexOptions)

onKeyStroke('ArrowRight', () => {
  if (shownControls.value < data.controls.length) {
    shownControls.value++
  }
})
onKeyStroke('ArrowLeft', () => {
  if (shownControls.value > 1) {
    shownControls.value--
  }
})

</script>
<template>
  <div class="flex flex-col items-center justify-center">

    <div class="Table__Title w-full">
      {{ data.class }}
    </div>
    <ApexCharts
        class="w-full bg-white px-8"
        width="100%"
        height="100%"
        type="line"
        :options="chartOptions" :series="series"
    ></ApexCharts>

    <div class="
      w-full flex flex-row justify-between items-center
      p-8 text-md font-co bg-white
      italic font-semibold
    ">
      <span v-for="(c) of data.controls">{{ c }}</span>
    </div>
  </div>
</template>

<style>
.apexcharts-data-labels {
  transition: all 0.2s ease-in-out;
  //color: var(--co-orange);
  //font-family: GTPlanar;
  //font-size: 24px;
}
</style>