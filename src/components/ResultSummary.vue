<script setup lang="ts">
import { computed } from 'vue'
import type { Scenario, ScenarioResult } from '../types'
import { PLAN_LABELS } from '../constants'
import { formatJPY } from '../utils/format'

const props = defineProps<{
  scenarios: Scenario[]
  results: ScenarioResult[]
}>()

const minTotalJPY = computed(() =>
  Math.min(...props.results.map(r => r.totalJPY))
)

interface SummaryItem {
  scenario: Scenario
  result: ScenarioResult
  monthlyAvg: number
  isCheapest: boolean
}

const items = computed<SummaryItem[]>(() =>
  props.scenarios.map((scenario, i) => {
    const result = props.results[i]
    return {
      scenario,
      result,
      monthlyAvg: result.totalJPY / 12,
      isCheapest: result.totalJPY === minTotalJPY.value,
    }
  })
)
</script>

<template>
  <section>
    <h2 class="mb-3 text-base font-semibold text-gray-700">年間コスト比較</h2>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="item in items"
        :key="item.scenario.id"
        class="relative rounded-xl border-2 bg-white p-4 shadow-sm"
        :style="{ borderColor: item.scenario.color }"
      >
        <!-- 最安値バッジ -->
        <span
          v-if="item.isCheapest"
          class="absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold text-white"
          :style="{ backgroundColor: item.scenario.color }"
        >最安</span>

        <div class="mb-1 text-sm font-semibold text-gray-700">
          {{ item.scenario.name }}
        </div>
        <div class="text-xs text-gray-400 mb-2">{{ PLAN_LABELS[item.scenario.planType] }}</div>

        <div class="text-xl font-bold text-gray-900">
          ¥{{ formatJPY(item.result.totalJPY) }}
        </div>
        <div class="text-xs text-gray-500">年間合計</div>

        <div class="mt-1 text-sm text-gray-600">
          月平均 ¥{{ formatJPY(item.monthlyAvg) }}
        </div>
      </div>
    </div>
  </section>
</template>
