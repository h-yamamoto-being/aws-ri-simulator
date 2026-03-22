import type { Scenario, ScenarioResult } from '../types'

/**
 * 月次支払い額（円）を12ヶ月分計算する
 */
export function calcMonthlyPaymentsJPY(scenario: Scenario): number[] {
  const { exchangeRates } = scenario
  const payments: number[] = []

  if (scenario.planType === 'onDemand') {
    const monthlyUSD = scenario.hourlyRate * scenario.hoursPerMonth
    for (let i = 0; i < 12; i++) {
      payments.push(monthlyUSD * exchangeRates[i])
    }
  } else if (scenario.planType === 'riNoUpfront') {
    const monthlyUSD = scenario.hourlyRate * scenario.hoursPerMonth * 0.72
    for (let i = 0; i < 12; i++) {
      payments.push(monthlyUSD * exchangeRates[i])
    }
  } else if (scenario.planType === 'riPartialUpfront') {
    // 1ヶ月目：(前払い額 + 月額) × rates[0]
    payments.push((scenario.upfrontFee + scenario.monthlyFee) * exchangeRates[0])
    // 2〜12ヶ月目：月額 × rates[month]
    for (let i = 1; i < 12; i++) {
      payments.push(scenario.monthlyFee * exchangeRates[i])
    }
  } else {
    // riFullUpfront: 年間一括を1ヶ月目のレートで円換算
    const annualUSD = scenario.hourlyRate * scenario.hoursPerMonth * 12 * 0.68
    payments.push(annualUSD * exchangeRates[0])
    for (let i = 1; i < 12; i++) {
      payments.push(0)
    }
  }

  return payments
}

/**
 * シナリオの計算結果（月次・累計・合計）を返す
 */
export function calcScenarioResult(scenario: Scenario): ScenarioResult {
  const monthlyPaymentsJPY = calcMonthlyPaymentsJPY(scenario)

  const cumulativeJPY: number[] = []
  let running = 0
  for (const payment of monthlyPaymentsJPY) {
    running += payment
    cumulativeJPY.push(running)
  }

  return {
    scenarioId: scenario.id,
    monthlyPaymentsJPY,
    cumulativeJPY,
    totalJPY: running,
  }
}
