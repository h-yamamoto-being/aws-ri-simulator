import type { Scenario } from '../types'

/** シナリオを更新する（同一idのものを置換）*/
export function replaceScenario(existing: Scenario[], updated: Scenario): Scenario[] {
  return existing.map(s => (s.id === updated.id ? updated : s))
}
