<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { TooltipItem } from 'chart.js'
import type { Scenario, ScenarioResult } from '../types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  scenarios: Scenario[]
  results: ScenarioResult[]
}>()

const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const chartData = computed(() => ({
  labels: MONTH_LABELS,
  datasets: props.scenarios.map((s, i) => ({
    label: s.name,
    data: props.results[i]?.cumulativeJPY ?? [],
    borderColor: s.color,
    backgroundColor: s.color + '22',
    borderWidth: 2,
    pointRadius: 3,
    tension: 0.1,
  })),
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { font: { size: 12 } },
    },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'line'>) =>
          `${ctx.dataset.label}: ¥${Math.round(ctx.parsed.y ?? 0).toLocaleString('ja-JP')}`,
      },
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value: string | number) =>
          `¥${Math.round(Number(value)).toLocaleString('ja-JP')}`,
      },
    },
  },
}
</script>

<template>
  <section>
    <h2 class="mb-3 text-base font-semibold text-gray-700">累計支払額の推移</h2>
    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" style="height: 320px">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>
