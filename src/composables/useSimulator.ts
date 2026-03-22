import { ref, computed } from 'vue'
import type { Scenario, ScenarioResult } from '../types'
import { DEFAULT_SCENARIOS } from '../constants'
import { calcScenarioResult } from '../utils/calculator'
import { addScenario, removeScenario, replaceScenario } from '../utils/scenarioHelpers'

export function useSimulator() {
  // DEFAULT_SCENARIOSのexchangeRatesは共有参照を避けるためディープコピー
  const scenarios = ref<Scenario[]>(
    DEFAULT_SCENARIOS.map(s => ({ ...s, exchangeRates: [...s.exchangeRates] }))
  )

  const results = computed<ScenarioResult[]>(() =>
    scenarios.value.map(calcScenarioResult)
  )

  function add() {
    scenarios.value = addScenario(scenarios.value)
  }

  function remove(id: string) {
    scenarios.value = removeScenario(scenarios.value, id)
  }

  function update(updated: Scenario) {
    scenarios.value = replaceScenario(scenarios.value, updated)
  }

  return { scenarios, results, add, remove, update }
}
