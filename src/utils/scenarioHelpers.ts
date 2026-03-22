import type { Scenario } from '../types'
import {
  SCENARIO_COLORS,
  DEFAULT_HOURLY_RATE,
  DEFAULT_HOURS_PER_MONTH,
  VALIDATION,
} from '../constants'

/** 新しいシナリオのデフォルト値を生成する */
export function createScenario(existing: Scenario[]): Scenario {
  const usedColors = new Set(existing.map(s => s.color))
  const color =
    SCENARIO_COLORS.find(c => !usedColors.has(c)) ??
    SCENARIO_COLORS[existing.length % SCENARIO_COLORS.length]

  return {
    id: crypto.randomUUID(),
    name: `シナリオ ${existing.length + 1}`,
    color,
    planType: 'onDemand',
    hourlyRate: DEFAULT_HOURLY_RATE,
    hoursPerMonth: DEFAULT_HOURS_PER_MONTH,
  }
}

/** シナリオを追加する（上限8件）*/
export function addScenario(existing: Scenario[]): Scenario[] {
  if (existing.length >= VALIDATION.scenarioCount.max) return existing
  return [...existing, createScenario(existing)]
}

/** シナリオを削除する（最低1件を保持）*/
export function removeScenario(existing: Scenario[], id: string): Scenario[] {
  if (existing.length <= VALIDATION.scenarioCount.min) return existing
  return existing.filter(s => s.id !== id)
}

/** シナリオを更新する（同一idのものを置換）*/
export function replaceScenario(existing: Scenario[], updated: Scenario): Scenario[] {
  return existing.map(s => (s.id === updated.id ? updated : s))
}
