import type { GlobalFeedItem } from "helpers/activity-feed-mock-data"
import type { ViewerActivityEntry, ViewerFeedVote } from "providers/ViewerActivityProvider"

/** A single action logged on a particular day — "pushed an app", "voted", etc. */
export type ContributionAction = {
  /** Milliseconds since epoch for the action. */
  at: number
  /** Optional weight; defaults to 1. Heavier actions (e.g. publishing) can boost the tile level. */
  weight?: number
}

/** `YYYY-MM-DD` in the viewer's local timezone — same key used by the grid. */
export type DateKey = string

export type ContributionData = {
  /** Total weighted actions across the year — shown as the graph title count. */
  total: number
  year: number
  /** `dateKey → weighted count`. Missing days are treated as zero. */
  counts: Record<DateKey, number>
  /** Highest single-day count; used to bucket tiles into 4 intensity levels. */
  max: number
}

export function dateKeyFromMs(ms: number): DateKey {
  const d = new Date(ms)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function hashStr(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

/** Deterministic PRNG in [0, 1) seeded by `seed` — matches the style used in `profile-mock-data`. */
function rngFromSeed(seed: string): () => number {
  let state = hashStr(seed) || 1
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0xffffffff
  }
}

function msAtLocalMidnight(year: number, monthIdx0: number, dayOfMonth: number): number {
  return new Date(year, monthIdx0, dayOfMonth).getTime()
}

/**
 * Deterministic mock contributions across a given `year` — keeps the graph filled for
 * mock profiles where we don't have real action timestamps for every day. The
 * distribution mirrors the reference screenshot: sparse late in the year, denser
 * and more frequent in Q1–Q2.
 */
function mockContributionsForHandle(handle: string, year: number): Record<DateKey, number> {
  const rng = rngFromSeed(`contrib:${handle}:${year}`)
  const out: Record<DateKey, number> = {}
  const now = Date.now()

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      const ms = msAtLocalMidnight(year, month, day)
      if (ms > now) continue

      const recencyFactor = 1 - month / 18
      const r = rng()
      if (r > 0.35 * recencyFactor) continue

      let count = 1
      if (r < 0.18 * recencyFactor) count = 2
      if (r < 0.09 * recencyFactor) count = 3 + Math.floor(rng() * 4)

      const key = dateKeyFromMs(ms)
      out[key] = (out[key] ?? 0) + count
    }
  }

  return out
}

type BuildArgs = {
  /** `null` means the signed-in viewer — real counts come from `viewerActivity`. */
  handle: string | null
  feed: GlobalFeedItem[]
  viewerActivity?: {
    feedVotes: Record<string, ViewerFeedVote>
    commentActivity: ViewerActivityEntry[]
    remixActivity: ViewerActivityEntry[]
    /** Viewer-authored feed items (their published apps). */
    ouroFeedItems: GlobalFeedItem[]
  }
  /** Defaults to the current calendar year. */
  year?: number
}

export function buildContributionData(args: BuildArgs): ContributionData {
  const year = args.year ?? new Date().getFullYear()
  const actions: ContributionAction[] = []

  if (args.handle != null) {
    const handle = args.handle
    for (const item of args.feed) {
      if (item.builder === handle) {
        actions.push({ at: item.createdAt, weight: 2 })
      }
      for (const c of item.initialComments) {
        if (c.author === handle) {
          actions.push({ at: c.createdAt })
        }
      }
    }
  } else if (args.viewerActivity) {
    const { commentActivity, remixActivity, ouroFeedItems } = args.viewerActivity
    for (const item of ouroFeedItems) {
      actions.push({ at: item.createdAt, weight: 2 })
    }
    for (const entry of commentActivity) actions.push({ at: entry.at })
    for (const entry of remixActivity) actions.push({ at: entry.at, weight: 2 })
  }

  const counts: Record<DateKey, number> = args.handle
    ? mockContributionsForHandle(args.handle, year)
    : mockContributionsForHandle("viewer", year)

  for (const action of actions) {
    const d = new Date(action.at)
    if (d.getFullYear() !== year) continue
    const key = dateKeyFromMs(action.at)
    counts[key] = (counts[key] ?? 0) + (action.weight ?? 1)
  }

  let total = 0
  let max = 0
  for (const value of Object.values(counts)) {
    total += value
    if (value > max) max = value
  }

  return { total, year, counts, max }
}

/** Maps a day's count to one of five display levels (0 = empty, 1–4 = increasing). */
export function contributionLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0
  if (max <= 1) return 1
  const ratio = count / max
  if (ratio > 0.66) return 4
  if (ratio > 0.33) return 3
  if (ratio > 0.12) return 2
  return 1
}
