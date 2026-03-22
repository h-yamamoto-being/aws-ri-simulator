<script setup lang="ts">
import { useSimulator } from './composables/useSimulator'
import ExchangeRateInput from './components/ExchangeRateInput.vue'
import ScenarioList from './components/ScenarioList.vue'
import ResultSummary from './components/ResultSummary.vue'
import ResultChart from './components/ResultChart.vue'
import ResultTable from './components/ResultTable.vue'
import BreakEvenNote from './components/BreakEvenNote.vue'

const { scenarios, rates, results, add, remove, update, updateRates } = useSimulator()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
      <div class="mx-auto max-w-screen-xl">
        <h1 class="text-lg font-bold text-gray-900">
          AWS RDS for Oracle RI シミュレーター
        </h1>
        <p class="mt-0.5 text-xs text-gray-500">
          リザーブドインスタンスとオンデマンドの年間コストをシナリオ別に比較
        </p>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="mx-auto max-w-screen-xl space-y-8 px-4 py-6">
      <!-- 為替レート（全シナリオ共通） -->
      <section class="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <h2 class="mb-1 text-base font-semibold text-gray-700">為替レート（全シナリオ共通）</h2>
        <ExchangeRateInput :rates="rates" @update:rates="updateRates" />
      </section>

      <!-- シナリオ一覧 -->
      <ScenarioList
        :scenarios="scenarios"
        @add="add"
        @remove="remove"
        @update:scenario="update"
      />

      <!-- 結果表示 -->
      <template v-if="results.length > 0">
        <ResultSummary :scenarios="scenarios" :results="results" />
        <ResultChart :scenarios="scenarios" :results="results" />
        <ResultTable :scenarios="scenarios" :results="results" />
        <BreakEvenNote :scenarios="scenarios" :results="results" />
      </template>
    </main>
  </div>
</template>
