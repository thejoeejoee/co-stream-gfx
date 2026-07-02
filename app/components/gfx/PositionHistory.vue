<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { line, curveMonotoneX } from 'd3-shape'
import duration from 'format-duration-time'
import type { IPositionHistory, IPositionHistoryRunner } from '~/types/api.d'

const props = defineProps<{ data: IPositionHistory }>()
const data = props.data

// --- Layout (SVG user units; scales to container via viewBox) ---
const VIEW_W = 1440
const VIEW_H = 720
const PAD = { top: 56, right: 420, bottom: 72, left: 80 }
const PLOT_W = VIEW_W - PAD.left - PAD.right
const PLOT_H = VIEW_H - PAD.top - PAD.bottom

// Rainbow palette for up to 6 runners.
const PALETTE = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#22c55e', // green
  '#38bdf8', // sky
  '#818cf8', // indigo
  '#c084fc', // purple
]
const colorFor = (i: number) => PALETTE[i % PALETTE.length]!


// --- Animation timing (seconds) ---
const DRAW_DURATION = 0.9 // one line draws start->finish
const STAGGER = 0.45 // gap between consecutive lines starting

// --- Scales ---
const xAt = (controlIdx: number): number => {
  const n = data.controls.length
  if (n <= 1) return PAD.left + PLOT_W / 2
  return PAD.left + (PLOT_W * controlIdx) / (n - 1)
}

const maxGap = computed(() => {
  const all = data.data.flatMap(r => r.history.map(h => h.time_loss))
  const m = all.length ? Math.max(...all) : 0
  return m > 0 ? m * 1.1 : 1
})

// Leader (0) at TOP, larger gaps sink downward.
const yAt = (gap: number): number => PAD.top + (PLOT_H * gap) / maxGap.value

const formatGap = (seconds: number): string =>
  `+${duration(seconds, 's').format('mm:ss')}`

interface Point { x: number, y: number }
interface RunnerSeries {
  name: string
  color: string
  path: string
  points: Point[]
  finalGap: number
  drawDelay: number
  labelDelay: number
  end: Point & { label: string }
}

const pathBuilder = line<Point>()
  .x(p => p.x)
  .y(p => p.y)
  .curve(curveMonotoneX)

const series = computed<RunnerSeries[]>(() => {
  // Final placement by cumulative gap (ascending): 1st = leader (smallest gap).
  const placement = data.data
    .map((runner, runnerIdx) => ({
      runnerIdx,
      finalGap: runner.history[runner.history.length - 1]?.time_loss ?? 0,
    }))
    .sort((a, b) => a.finalGap - b.finalGap)
    .map(r => r.runnerIdx)

  const built = data.data.map((runner: IPositionHistoryRunner, runnerIdx: number) => {
    // Rainbow palette — no podium override, just use index directly.
    const color = colorFor(runnerIdx)
    const points: Point[] = runner.history.map((h, controlIdx) => ({
      x: xAt(controlIdx),
      y: yAt(h.time_loss),
    }))

    const last = points[points.length - 1]!
    const finalGap = runner.history[runner.history.length - 1]?.time_loss ?? 0

    return {
      name: runner.name,
      color,
      path: pathBuilder(points) ?? '',
      points,
      finalGap,
      drawDelay: 0,
      labelDelay: 0,
      end: { ...last, label: finalGap > 0 ? `${runner.name}  ${formatGap(finalGap)}` : runner.name },
    }
  })

  // Draw order: worst (largest final gap) first, best (leader) last.
  const order = [...built]
    .sort((a, b) => b.finalGap - a.finalGap)
    .map(s => s.name)

  for (const s of built) {
    const rank = order.indexOf(s.name)
    s.drawDelay = rank * STAGGER
    s.labelDelay = rank * STAGGER + DRAW_DURATION
  }

  // Paint order = DOM order in SVG: render worst first so the best (leader) draws on top.
  const sorted = [...built].sort((a, b) => b.finalGap - a.finalGap)

  // Spread overlapping end-labels: when multiple runners share the same (or near-same)
  // finalGap their labels land on identical Y coords. Nudge them apart.
  const MIN_LABEL_GAP = 34 // SVG units; slightly above font-size (27px)
  const byY = [...sorted].sort((a, b) => a.end.y - b.end.y)
  for (let i = 1; i < byY.length; i++) {
    const prev = byY[i - 1]!
    const curr = byY[i]!
    if (curr.end.y - prev.end.y < MIN_LABEL_GAP) {
      curr.end.y = prev.end.y + MIN_LABEL_GAP
    }
  }

  return sorted
})

// Worst (max) gap at each split; Finish (last) is always skipped.
// Start (index 0) is skipped only when all runners have time_loss === 0 there.
interface WorstGap { x: number, y: number, label: string }
const worstGaps = computed<WorstGap[]>(() => {
  return data.controls
    .map((_c, controlIdx) => {
      if (controlIdx === data.controls.length - 1) return null
      const gaps = data.data.map(r => r.history[controlIdx]?.time_loss ?? 0)
      const worst = gaps.length ? Math.max(...gaps) : 0
      if (controlIdx === 0 && worst === 0) return null
      return { x: xAt(controlIdx), y: yAt(worst), label: formatGap(worst) }
    })
    .filter((v): v is WorstGap => v !== null)
})

// Reveal the worst-gap annotations once every line has finished drawing.
const worstRevealDelay = computed(() => {
  const maxDraw = series.value.reduce((m, s) => Math.max(m, s.drawDelay), 0)
  return maxDraw + DRAW_DURATION
})

// Draw-on animation driven imperatively on the DOM elements. Reactive inline
// styles + rAF race with Vue's batched patch (transition never fires), so we
// set the dash on each <path> directly: hidden state -> forced reflow -> draw.
const pathEls = ref<SVGPathElement[]>([])
const markerFadeArmed = ref(false)

onMounted(() => {
  const els = pathEls.value.filter(Boolean)
  // 1. Prime every line to its fully-hidden state (offset = its own length).
  for (const el of els) {
    const len = el.getTotalLength()
    el.style.transition = 'none'
    el.style.strokeDasharray = String(len)
    el.style.strokeDashoffset = String(len)
  }
  // 2. Force a reflow so the hidden state is committed before we animate.
  void (els[0]?.getBoundingClientRect())
  // 3. Arm each line's draw with its staggered delay; fade markers/labels in
  //    only after all lines have drawn.
  requestAnimationFrame(() => {
    for (let i = 0; i < els.length; i++) {
      const el = els[i]!
      const delay = series.value[i]?.drawDelay ?? 0
      el.style.transition = `stroke-dashoffset ${DRAW_DURATION}s ease-in-out ${delay}s`
      el.style.strokeDashoffset = '0'
    }
    markerFadeArmed.value = true
  })
})
</script>

<template>
  <div class="PositionHistory flex flex-col items-center justify-center">
    <div class="Table__Title w-full">
      <span class="mr-auto" v-text="data.title" />
      <span v-text="data.class" />
    </div>

    <svg
      class="PositionHistory__Svg w-full flex-1 min-h-0 bg-white"
      :class="{ 'PositionHistory__Svg--armed': markerFadeArmed }"
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- vertical guide per control -->
      <line
        v-for="(c, i) in data.controls"
        :key="`guide-${i}`"
        :x1="xAt(i)"
        :x2="xAt(i)"
        :y1="PAD.top"
        :y2="PAD.top + PLOT_H"
        class="PositionHistory__Guide"
      />

      <!-- runner slope lines (draw start->finish, worst first) -->
      <path
        v-for="(s, i) in series"
        :key="`line-${i}`"
        :ref="el => { if (el) pathEls[i] = el as SVGPathElement }"
        :d="s.path"
        :stroke="s.color"
        class="PositionHistory__Line"
      />

      <!-- point markers -->
      <template
        v-for="(s, i) in series"
        :key="`pts-${i}`"
      >
        <circle
          v-for="(p, j) in s.points"
          :key="`pt-${i}-${j}`"
          :cx="p.x"
          :cy="p.y"
          r="10"
          :fill="s.color"
          class="PositionHistory__Marker"
          :style="{ transitionDelay: `${s.labelDelay}s` }"
        />
      </template>

      <!-- worst (max) gap per split, just below the worst point -->
      <g
        v-for="(w, i) in worstGaps"
        :key="`worst-${i}`"
        class="PositionHistory__WorstGap"
        :style="{ transitionDelay: `${worstRevealDelay}s` }"
      >
        <rect
          :x="w.x - (w.label.length * 9 + 14)"
          :y="w.y + 44 - 28"
          :width="w.label.length * 18 + 28"
          :height="42"
          rx="8"
          ry="8"
          fill="white"
        />
        <text
          :x="w.x"
          :y="w.y + 44"
          text-anchor="middle"
        >{{ w.label }}</text>
      </g>

      <!-- end-side labels (name + gap) -->
      <text
        v-for="(s, i) in series"
        :key="`end-${i}`"
        :x="s.end.x + 14"
        :y="s.end.y"
        :fill="s.color"
        text-anchor="start"
        dominant-baseline="middle"
        class="PositionHistory__Label"
        :style="{ transitionDelay: `${s.labelDelay}s` }"
      >{{ s.end.label }}</text>
      <!-- control (x-axis) labels, aligned to guides -->
      <text
        v-for="(c, i) in data.controls"
        :key="`ctrl-${i}`"
        :x="xAt(i)"
        :y="PAD.top + PLOT_H + 34"
        text-anchor="middle"
        class="PositionHistory__Control"
      >{{ c }}</text>
    </svg>

  </div>
</template>

<style scoped lang="postcss">
.PositionHistory__Svg {
  display: block;
}

.PositionHistory__Guide {
  stroke: #e5e7eb;
  stroke-width: 1;
}

.PositionHistory__Control {
  font-family: var(--gfx-font-family, GTPlanar, sans-serif);
  font-size: 34px;
  font-weight: 600;
  fill: #111827;
}

.PositionHistory__Line {
  fill: none;
  stroke-width: 12;
  stroke-linecap: round;
  stroke-linejoin: round;
  /* draw-on dash values + transition are set inline (bound to measured
     path length + armed), since CSS px units don't match user coordinates. */
}

.PositionHistory__Marker,
.PositionHistory__Label,
.PositionHistory__WorstGap {
  opacity: 0;
}

.PositionHistory__Marker {
  transition: opacity 0.3s ease-in-out;
}

.PositionHistory__WorstGap {
  font-family: var(--gfx-font-family, GTPlanar, sans-serif);
  font-size: 36px;
  font-weight: 600;
  fill: #6b7280;
  transition: opacity 0.3s ease-in-out;
}

.PositionHistory__Label {
  font-family: var(--gfx-font-family, GTPlanar, sans-serif);
  font-size: 36px;
  font-weight: 600;
  transition: opacity 0.3s ease-in-out;
}

.PositionHistory__Svg--armed .PositionHistory__Marker,
.PositionHistory__Svg--armed .PositionHistory__Label,
.PositionHistory__Svg--armed .PositionHistory__WorstGap {
  opacity: 1;
}
</style>
