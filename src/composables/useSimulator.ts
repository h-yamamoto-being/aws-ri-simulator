import { ref, computed } from 'vue'
import type { Scenario, ScenarioResult } from '../types'
import { DEFAULT_SCENARIOS, DEFAULT_RATES } from '../constants'
import { calcScenarioResult } from '../utils/calculator'
import { replaceScenario } from '../utils/scenarioHelpers'

export function useSimulator() {
  const scenarios = ref<Scenario[]>([...DEFAULT_SCENARIOS])

  // 全シナリオ共通の為替レート（12ヶ月分）
  const rates = ref<number[]>([...DEFAULT_RATES])

  const results = computed<ScenarioResult[]>(() =>
    scenarios.value.map(s => calcScenarioResult(s, rates.value))
  )

  function update(updated: Scenario) {
    scenarios.value = replaceScenario(scenarios.value, updated)
  }

  function updateRates(newRates: number[]) {
    rates.value = newRates
  }

  return { scenarios, rates, results, update, updateRates }
}
