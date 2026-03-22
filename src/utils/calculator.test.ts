import { describe, it, expect } from 'vitest'
import { calcMonthlyPaymentsJPY, calcScenarioResult } from './calculator'
import type { HourlyScenario, PartialUpfrontScenario } from '../types'

const rates150 = Array(12).fill(150) as number[]

// テスト用シナリオファクトリ（為替レートは別引数のため含まない）
const onDemand = (hourlyRate = 8.896, hoursPerMonth = 744): HourlyScenario => ({
  id: 'test',
  name: 'オンデマンド',
  color: '#000',
  planType: 'onDemand',
  hourlyRate,
  hoursPerMonth,
})

const riNoUpfront = (hourlyRate = 8.896, hoursPerMonth = 744): HourlyScenario => ({
  id: 'test',
  name: 'RI前払いなし',
  color: '#000',
  planType: 'riNoUpfront',
  hourlyRate,
  hoursPerMonth,
})

const riPartialUpfront = (upfrontFee = 27275, monthlyFee = 2272.93): PartialUpfrontScenario => ({
  id: 'test',
  name: 'RI一部前払い',
  color: '#000',
  planType: 'riPartialUpfront',
  upfrontFee,
  monthlyFee,
})

const riFullUpfront = (hourlyRate = 8.896, hoursPerMonth = 744): HourlyScenario => ({
  id: 'test',
  name: 'RI全額前払い',
  color: '#000',
  planType: 'riFullUpfront',
  hourlyRate,
  hoursPerMonth,
})

// -----------------------------------------------------------------------
// calcMonthlyPaymentsJPY
// -----------------------------------------------------------------------

describe('calcMonthlyPaymentsJPY - オンデマンド', () => {
  it('毎月 hourlyRate × hoursPerMonth × rate の支払いになる', () => {
    const payments = calcMonthlyPaymentsJPY(onDemand(10, 100), rates150)
    // 10 × 100 × 150 = 150,000
    expect(payments).toHaveLength(12)
    payments.forEach(p => expect(p).toBeCloseTo(150000))
  })

  it('為替レートが月ごとに異なる場合は各月のレートを使う', () => {
    const rates = Array.from({ length: 12 }, (_, i) => 140 + i) // 140〜151
    const payments = calcMonthlyPaymentsJPY(onDemand(10, 100), rates)
    payments.forEach((p, i) => expect(p).toBeCloseTo(10 * 100 * (140 + i)))
  })
})

describe('calcMonthlyPaymentsJPY - RI前払いなし', () => {
  it('毎月 onDemandMonthly × 0.72 × rate になる（28%割引）', () => {
    const payments = calcMonthlyPaymentsJPY(riNoUpfront(10, 100), rates150)
    // 10 × 100 × 0.72 × 150 = 108,000
    expect(payments).toHaveLength(12)
    payments.forEach(p => expect(p).toBeCloseTo(108000))
  })

  it('オンデマンドより支払いが少ない', () => {
    const noUpfront = calcMonthlyPaymentsJPY(riNoUpfront(), rates150)
    const demand = calcMonthlyPaymentsJPY(onDemand(), rates150)
    noUpfront.forEach((p, i) => expect(p).toBeLessThan(demand[i]))
  })
})

describe('calcMonthlyPaymentsJPY - RI一部前払い', () => {
  it('1ヶ月目は (前払い額 + 月額) × rates[0]', () => {
    const payments = calcMonthlyPaymentsJPY(riPartialUpfront(10000, 1000), rates150)
    expect(payments[0]).toBeCloseTo((10000 + 1000) * 150)
  })

  it('2〜12ヶ月目は 月額 × rates[month]', () => {
    const payments = calcMonthlyPaymentsJPY(riPartialUpfront(10000, 1000), rates150)
    for (let i = 1; i < 12; i++) {
      expect(payments[i]).toBeCloseTo(1000 * 150)
    }
  })

  it('為替レートが月ごとに異なる場合、前払い分は1ヶ月目のレートのみ使用', () => {
    const rates = Array.from({ length: 12 }, (_, i) => 100 + i * 10)
    const payments = calcMonthlyPaymentsJPY(riPartialUpfront(5000, 2000), rates)
    expect(payments[0]).toBeCloseTo((5000 + 2000) * 100)
    for (let i = 1; i < 12; i++) {
      expect(payments[i]).toBeCloseTo(2000 * (100 + i * 10))
    }
  })
})

describe('calcMonthlyPaymentsJPY - RI全額前払い', () => {
  it('1ヶ月目のみ年間一括 (hourlyRate × hoursPerMonth × 12 × 0.68) × rates[0]', () => {
    const payments = calcMonthlyPaymentsJPY(riFullUpfront(10, 100), rates150)
    // 10 × 100 × 12 × 0.68 × 150 = 1,224,000
    expect(payments[0]).toBeCloseTo(10 * 100 * 12 * 0.68 * 150)
  })

  it('全額前払いは1ヶ月目のレートのみ使用し、2〜12ヶ月目は0円', () => {
    const rates = Array.from({ length: 12 }, (_, i) => 100 + i * 10)
    const payments = calcMonthlyPaymentsJPY(riFullUpfront(10, 100), rates)
    expect(payments[0]).toBeCloseTo(10 * 100 * 12 * 0.68 * 100) // rates[0] = 100
    for (let i = 1; i < 12; i++) {
      expect(payments[i]).toBe(0)
    }
  })

  it('配列の長さは12', () => {
    expect(calcMonthlyPaymentsJPY(riFullUpfront(), rates150)).toHaveLength(12)
  })
})

// -----------------------------------------------------------------------
// calcScenarioResult
// -----------------------------------------------------------------------

describe('calcScenarioResult', () => {
  it('scenarioId が正しくセットされる', () => {
    const result = calcScenarioResult({ ...onDemand(), id: 'abc' }, rates150)
    expect(result.scenarioId).toBe('abc')
  })

  it('monthlyPaymentsJPY・cumulativeJPY はそれぞれ12要素', () => {
    const result = calcScenarioResult(onDemand(), rates150)
    expect(result.monthlyPaymentsJPY).toHaveLength(12)
    expect(result.cumulativeJPY).toHaveLength(12)
  })

  it('cumulativeJPY は累積和になっている', () => {
    const result = calcScenarioResult(onDemand(10, 100), rates150)
    // 毎月150,000円なので cumulative[i] = 150,000 × (i+1)
    result.cumulativeJPY.forEach((c, i) => {
      expect(c).toBeCloseTo(150000 * (i + 1))
    })
  })

  it('totalJPY は cumulativeJPY の最終値と等しい', () => {
    const result = calcScenarioResult(onDemand(), rates150)
    expect(result.totalJPY).toBeCloseTo(result.cumulativeJPY[11])
  })

  it('全額前払いの totalJPY = 1ヶ月目の支払いのみ', () => {
    const result = calcScenarioResult(riFullUpfront(10, 100), rates150)
    expect(result.totalJPY).toBeCloseTo(result.monthlyPaymentsJPY[0])
  })

  it('RI前払いなしの年間合計がオンデマンドより安い', () => {
    const demandTotal = calcScenarioResult(onDemand(), rates150).totalJPY
    const noUpfrontTotal = calcScenarioResult(riNoUpfront(), rates150).totalJPY
    expect(noUpfrontTotal).toBeLessThan(demandTotal)
  })
})
