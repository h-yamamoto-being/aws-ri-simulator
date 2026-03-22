import { describe, it, expect } from 'vitest'
import { calculateSavings, calculateSavingsRate } from './calculator'

describe('calculateSavings', () => {
  it('節約額が正しく計算される', () => {
    expect(calculateSavings(0.1, 0.06, 8760)).toBeCloseTo(350.4)
  })

  it('単価が同じ場合は節約額が0になる', () => {
    expect(calculateSavings(0.1, 0.1, 8760)).toBe(0)
  })
})

describe('calculateSavingsRate', () => {
  it('節約率が正しく計算される', () => {
    expect(calculateSavingsRate(0.1, 0.06)).toBeCloseTo(40)
  })

  it('オンデマンド単価が0の場合は0を返す', () => {
    expect(calculateSavingsRate(0, 0)).toBe(0)
  })
})
