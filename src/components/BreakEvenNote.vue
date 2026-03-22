<script setup lang="ts">
import { computed } from 'vue'
import type { Scenario, ScenarioResult } from '../types'

const props = defineProps<{
  scenarios: Scenario[]
  results: ScenarioResult[]
}>()

interface BreakEvenInfo {
  scenario: Scenario
  baselineScenario: Scenario
  month: number | null // null = 全期間通じて高い（逆転なし）
}

const notes = computed<BreakEvenInfo[]>(() => {
  // 最も年間合計が高いシナリオをベースラインとする
  const maxTotal = Math.max(...props.results.map(r => r.totalJPY))
  const baselineIndex = props.results.findIndex(r => r.totalJPY === maxTotal)
  if (baselineIndex === -1 || props.scenarios.length < 2) return []

  const baselineScenario = props.scenarios[baselineIndex]
  const baselineResult = props.results[baselineIndex]

  return props.scenarios
    .map((scenario, i) => {
      if (i === baselineIndex) return null

      const result = props.results[i]
      // 累計コストがベースラインを下回る最初の月を探す
      let crossMonth: number | null = null
      for (let m = 0; m < 12; m++) {
        if (result.cumulativeJPY[m] < baselineResult.cumulativeJPY[m]) {
          crossMonth = m + 1
          break
        }
      }

      return { scenario, baselineScenario, month: crossMonth }
    })
    .filter((n): n is BreakEvenInfo => n !== null && n.scenario.id !== baselineScenario.id)
})
</script>

<template>
  <section v-if="notes.length > 0">
    <h2 class="mb-3 text-base font-semibold text-gray-700">損益分岐点</h2>
    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
      <div
        v-for="note in notes"
        :key="note.scenario.id"
        class="flex items-start gap-2 text-sm"
      >
        <span
          class="mt-0.5 inline-block h-3 w-3 shrink-0 rounded-full"
          :style="{ backgroundColor: note.scenario.color }"
        />
        <span class="text-gray-700">
          <span class="font-semibold" :style="{ color: note.scenario.color }">
            {{ note.scenario.name }}
          </span>
          は
          <template v-if="note.month !== null">
            <span class="font-semibold">{{ note.month }}ヶ月目</span>
            から
            <span class="font-semibold" :style="{ color: note.baselineScenario.color }">
              {{ note.baselineScenario.name }}
            </span>
            より安くなります
          </template>
          <template v-else>
            12ヶ月間を通じて
            <span class="font-semibold" :style="{ color: note.baselineScenario.color }">
              {{ note.baselineScenario.name }}
            </span>
            より高コストです
          </template>
        </span>
      </div>
    </div>
  </section>
</template>
