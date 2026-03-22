/** 円表示：小数点なし・3桁カンマ */
export function formatJPY(value: number): string {
  return Math.round(value).toLocaleString('ja-JP')
}

/** ドル表示：小数点2桁 */
export function formatUSD(value: number): string {
  return value.toFixed(2)
}
