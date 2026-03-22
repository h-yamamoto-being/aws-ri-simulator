export type PlanType = 'onDemand' | 'riNoUpfront' | 'riPartialUpfront' | 'riFullUpfront'

interface ScenarioBase {
  id: string
  name: string
  color: string
  exchangeRates: number[] // 12要素（月ごとの円/ドルレート）
}

export interface HourlyScenario extends ScenarioBase {
  planType: 'onDemand' | 'riNoUpfront' | 'riFullUpfront'
  hourlyRate: number    // USD/hour
  hoursPerMonth: number // 月間稼働時間
}

export interface PartialUpfrontScenario extends ScenarioBase {
  planType: 'riPartialUpfront'
  upfrontFee: number  // RIの前払い料金（USD）
  monthlyFee: number  // RIの月額料金（USD）
}

export type Scenario = HourlyScenario | PartialUpfrontScenario

export interface ScenarioResult {
  scenarioId: string
  monthlyPaymentsJPY: number[] // 12要素（月次支払い額・円）
  cumulativeJPY: number[]      // 12要素（累計支払い額・円）
  totalJPY: number             // 年間合計（円）
}
