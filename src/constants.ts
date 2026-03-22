import type { Scenario } from './types'

// デフォルト値
export const DEFAULT_HOURLY_RATE = 8.896          // db.r6i.4xlarge 東京・マルチAZ・ライセンス込み
export const DEFAULT_HOURS_PER_MONTH = 744         // 31日 × 24時間
export const DEFAULT_EXCHANGE_RATE = 150           // 円/ドル
export const DEFAULT_PARTIAL_UPFRONT_FEE = 27275   // 一部前払い：前払い額（USD）
export const DEFAULT_PARTIAL_MONTHLY_FEE = 2272.93 // 一部前払い：月額（USD）

// バリデーション範囲
export const VALIDATION = {
  hourlyRate: { min: 0.001, max: 999.999 },
  hoursPerMonth: { min: 1, max: 744 },
  upfrontFee: { min: 0 },
  monthlyFee: { min: 0 },
  exchangeRate: { min: 1, max: 999 },
  scenarioCount: { min: 1, max: 8 },
} as const

// プランタイプの表示名
export const PLAN_LABELS = {
  onDemand: 'オンデマンド',
  riNoUpfront: 'RI・前払いなし',
  riPartialUpfront: 'RI・一部前払い',
  riFullUpfront: 'RI・全額前払い',
} as const

// シナリオカラーパレット（最大8色）
export const SCENARIO_COLORS = [
  '#EF4444', // red-500
  '#3B82F6', // blue-500
  '#22C55E', // green-500
  '#F97316', // orange-500
  '#A855F7', // purple-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#EAB308', // yellow-500
]

// デフォルト為替レート（12ヶ月分・全シナリオ共通）
export const DEFAULT_RATES: number[] = Array(12).fill(DEFAULT_EXCHANGE_RATE)

// 初期表示シナリオ（4プラン）
export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: '1',
    name: PLAN_LABELS.onDemand,
    color: SCENARIO_COLORS[0],
    planType: 'onDemand',
    hourlyRate: DEFAULT_HOURLY_RATE,
    hoursPerMonth: DEFAULT_HOURS_PER_MONTH,
  },
  {
    id: '2',
    name: PLAN_LABELS.riNoUpfront,
    color: SCENARIO_COLORS[1],
    planType: 'riNoUpfront',
    hourlyRate: DEFAULT_HOURLY_RATE,
    hoursPerMonth: DEFAULT_HOURS_PER_MONTH,
  },
  {
    id: '3',
    name: PLAN_LABELS.riPartialUpfront,
    color: SCENARIO_COLORS[2],
    planType: 'riPartialUpfront',
    upfrontFee: DEFAULT_PARTIAL_UPFRONT_FEE,
    monthlyFee: DEFAULT_PARTIAL_MONTHLY_FEE,
  },
  {
    id: '4',
    name: PLAN_LABELS.riFullUpfront,
    color: SCENARIO_COLORS[3],
    planType: 'riFullUpfront',
    hourlyRate: DEFAULT_HOURLY_RATE,
    hoursPerMonth: DEFAULT_HOURS_PER_MONTH,
  },
]
