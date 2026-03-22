import type { Scenario, ScenarioResult } from '../types'

/**
 * 月次支払い額（円）を12ヶ月分計算する
 * @param scenario シナリオ設定
 * @param rates 全シナリオ共通の為替レート（12要素）
 */
export function calcMonthlyPaymentsJPY(scenario: Scenario, rates: number[]): number[] {
  const payments: number[] = []

  if (scenario.planType === 'onDemand') {
    const monthlyUSD = scenario.hourlyRate * scenario.hoursPerMonth
    for (let i = 0; i < 12; i++) {
      payments.push(monthlyUSD * rates[i])
    }
  } else if (scenario.planType === 'riNoUpfront') {
    const monthlyUSD = scenario.hourlyRate * scenario.hoursPerMonth * 0.72
    for (let i = 0; i < 12; i++) {
      payments.push(monthlyUSD * rates[i])
    }
  } else if (scenario.planType === 'riPartialUpfront') {
    // 前払い分は1ヶ月目のレートのみ使用、月次分は毎月のレートを使用
    payments.push((scenario.upfrontFee + scenario.monthlyFee) * rates[0])
    for (let i = 1; i < 12; i++) {
      payments.push(scenario.monthlyFee * rates[i])
    }
  } else {
    // riFullUpfront: 年間一括を1ヶ月目のレートで円換算
    const annualUSD = scenario.hourlyRate * scenario.hoursPerMonth * 12 * 0.68
    payments.push(annualUSD * rates[0])
    for (let i = 1; i < 12; i++) {
      payments.push(0)
    }
  }

  return payments
}

/**
 * シナリオの計算結果（月次・累計・合計）を返す
 * @param scenario シナリオ設定
 * @param rates 全シナリオ共通の為替レート（12要素）
 */
export function calcScenarioResult(scenario: Scenario, rates: number[]): ScenarioResult {
  const monthlyPaymentsJPY = calcMonthlyPaymentsJPY(scenario, rates)

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
