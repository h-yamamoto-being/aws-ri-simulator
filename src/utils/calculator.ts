/**
 * AWS RI 節約額計算
 * @param onDemandPrice オンデマンド単価（時間あたり）
 * @param riPrice RI単価（時間あたり）
 * @param hours 利用時間
 * @returns 節約額
 */
export function calculateSavings(
  onDemandPrice: number,
  riPrice: number,
  hours: number
): number {
  return (onDemandPrice - riPrice) * hours
}

/**
 * 節約率を計算する
 * @param onDemandPrice オンデマンド単価
 * @param riPrice RI単価
 * @returns 節約率（%）
 */
export function calculateSavingsRate(
  onDemandPrice: number,
  riPrice: number
): number {
  if (onDemandPrice === 0) return 0
  return ((onDemandPrice - riPrice) / onDemandPrice) * 100
}
