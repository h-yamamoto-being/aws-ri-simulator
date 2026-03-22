<script setup lang="ts">
import type { Scenario, ScenarioResult } from '../types'
import { formatJPY } from '../utils/format'

const props = defineProps<{
  scenarios: Scenario[]
  results: ScenarioResult[]
}>()

const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
</script>

<template>
  <section>
    <h2 class="mb-3 text-base font-semibold text-gray-700">月別支払い明細</h2>
    <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="sticky left-0 bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-500">
              月
            </th>
            <th
              v-for="scenario in scenarios"
              :key="scenario.id"
              class="px-4 py-2 text-right text-xs font-semibold whitespace-nowrap"
              :style="{ color: scenario.color }"
            >
              {{ scenario.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(label, i) in MONTH_LABELS"
            :key="i"
            class="border-b border-gray-100 hover:bg-gray-50"
          >
            <td class="sticky left-0 bg-white px-4 py-2 text-xs text-gray-500 hover:bg-gray-50">
              {{ label }}
            </td>
            <td
              v-for="(result, j) in results"
              :key="j"
              class="px-4 py-2 text-right tabular-nums text-gray-800"
            >
              ¥{{ formatJPY(result.monthlyPaymentsJPY[i]) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border-t-2 border-gray-300 bg-gray-50 font-semibold">
            <td class="sticky left-0 bg-gray-50 px-4 py-2 text-xs text-gray-700">合計</td>
            <td
              v-for="(result, j) in results"
              :key="j"
              class="px-4 py-2 text-right tabular-nums text-gray-900"
            >
              ¥{{ formatJPY(result.totalJPY) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
</template>
