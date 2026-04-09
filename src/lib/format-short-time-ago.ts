const MS = 1
const SEC = 1000 * MS
const MIN = 60 * SEC
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const YEAR = 365 * DAY

/** Compact relative time: `1s`, `2m`, `3h`, `4d`, `2w`, `1y`. */
export function formatShortTimeAgo(
  pastEpochMs: number,
  nowEpochMs: number = Date.now()
): string {
  const elapsed = Math.max(0, nowEpochMs - pastEpochMs)

  if (elapsed >= YEAR) return `${Math.floor(elapsed / YEAR)}y`
  if (elapsed >= WEEK) return `${Math.floor(elapsed / WEEK)}w`
  if (elapsed >= DAY) return `${Math.floor(elapsed / DAY)}d`
  if (elapsed >= HOUR) return `${Math.floor(elapsed / HOUR)}h`
  if (elapsed >= MIN) return `${Math.floor(elapsed / MIN)}m`
  const s = Math.floor(elapsed / SEC)
  return `${Math.max(1, s)}s`
}
