import type { GlobalFeedItem } from "helpers/activity-feed-mock-data"
import { mockEthereumAddressFromSeed } from "helpers/abbrev-wallet"

/** Same shape as `ViewerActivityEntry` — kept local so helpers do not import providers. */
export type ProfileMockActivityEntry = {
  postId: string
  at: number
  excerpt: string
}

export type MockProfileCreatedRow = { id: string; title: string }

export type ProfileHeader = {
  /** `null` for the signed-in viewer ("You"). */
  handle: string | null
  displayName: string
  initials: string
  wallet: string
  bio: string
  joinedAt: number
  location?: string
  links: { label: string; href: string }[]
  /** 0–360 hue used to tint the banner — deterministic per handle. */
  accentHue: number
  verified: boolean
}

export type ProfileStats = {
  apps: number
  upvotesReceived: number
  remixes: number
  comments: number
  followers: number
  following: number
}

const HOUR = 3_600_000
const DAY = 86_400_000
const NOW = Date.now()

function hashStr(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

function pickIndicesFromPool(seed: string, poolSize: number, count: number): number[] {
  if (poolSize === 0) return []
  const out: number[] = []
  const used = new Set<number>()
  for (let i = 0; out.length < Math.min(count, poolSize) && i < poolSize * 4; i++) {
    const idx = hashStr(`${seed}|${i}`) % poolSize
    if (used.has(idx)) continue
    used.add(idx)
    out.push(idx)
  }
  return out
}

/**
 * Canonical mock data for the five `BUILDERS` in `activity-feed-mock-data` —
 * keeps display names and bios stable across every profile link in the feed.
 */
const HANDLE_DATA: Record<
  string,
  {
    displayName: string
    initials: string
    bio: string
    location?: string
    joinDaysAgo: number
    links?: { label: string; href: string }[]
  }
> = {
  sam_kim: {
    displayName: "Sam Kim",
    initials: "SK",
    bio: "Shipping tiny surfaces on the permaweb. Design and deploy in public.",
    location: "Seoul",
    joinDaysAgo: 312,
    links: [{ label: "sam.kim", href: "https://sam.kim" }],
  },
  ninaalvarez: {
    displayName: "Nina Alvarez",
    initials: "NA",
    bio: "Design systems, motion, AR storefronts. Bazar-style flows for small drops.",
    location: "Mexico City",
    joinDaysAgo: 241,
  },
  marcus_webb: {
    displayName: "Marcus Webb",
    initials: "MW",
    bio: "Deploys and runbooks. Less yak-shave, more ship.",
    location: "Austin",
    joinDaysAgo: 402,
  },
  devon_choi: {
    displayName: "Devon Choi",
    initials: "DC",
    bio: "Tile-based games on the permaweb. Llamaland chief llama.",
    location: "Portland",
    joinDaysAgo: 168,
  },
  priya_shah: {
    displayName: "Priya Shah",
    initials: "PS",
    bio: "Analytics → insight → action. KPIs that change behavior.",
    location: "Bengaluru",
    joinDaysAgo: 523,
  },
}

function humanizeHandle(handle: string): string {
  const parts = handle.split(/[_\-.]+/).filter(Boolean)
  if (parts.length === 0) return handle
  return parts.map((p) => p[0]!.toUpperCase() + p.slice(1)).join(" ")
}

function initialsFromHandle(handle: string): string {
  const human = humanizeHandle(handle)
  const letters = human
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return letters || handle.slice(0, 2).toUpperCase()
}

export function buildProfileHeaderForHandle(handle: string): ProfileHeader {
  const entry = HANDLE_DATA[handle]
  return {
    handle,
    displayName: entry?.displayName ?? humanizeHandle(handle),
    initials: entry?.initials ?? initialsFromHandle(handle),
    wallet: mockEthereumAddressFromSeed(`profile:${handle}`),
    bio: entry?.bio ?? "Builder on the permaweb.",
    joinedAt: NOW - (entry?.joinDaysAgo ?? 180) * DAY,
    location: entry?.location,
    links: entry?.links ?? [],
    accentHue: hashStr(`hue:${handle}`) % 360,
    verified: entry != null,
  }
}

export function buildViewerProfileHeader(walletAddress: string | null): ProfileHeader {
  const seed = walletAddress ?? "viewer:anon"
  return {
    handle: null,
    displayName: "You",
    initials: "YU",
    wallet: walletAddress ?? mockEthereumAddressFromSeed(seed),
    bio: "Publish apps, vote on remixes, and remix ideas from the feed.",
    joinedAt: NOW - DAY * 32,
    location: undefined,
    links: [],
    accentHue: hashStr(seed) % 360,
    verified: false,
  }
}

/** Deterministic feed ids for `Upvoted` / `Downvoted` tabs on author profiles. */
export function mockFeedIdsForHandle(
  handle: string,
  key: "upvoted" | "downvoted",
  pool: string[],
  count: number,
): string[] {
  const indices = pickIndicesFromPool(`${handle}:${key}`, pool.length, count)
  return indices.map((i) => pool[i]!)
}

const REMIX_EXCERPT_POOL = [
  "Strip the hero to one headline and a single CTA.",
  "Borrow the cohort chart for a weekly email digest.",
  "Listing chrome + AR row; want it on our drop page.",
  "Tile-based onboarding — map the rooms to steps.",
  "Export design tokens; wire them into the home hero.",
  "Roll the floor-depth panel into our live preview.",
  "Swap the modal for an inline drawer on mobile.",
] as const

const COMMENT_EXCERPT_POOL = [
  "Floor looks thin above this listing — still aped a little.",
  "Any chance we expose webhooks for checkout events?",
  "Price action looks fair; might park bids on this listing.",
  "Remixed the checkout flow; paid the mint in AR.",
  "Deploy timeline is clean — linking this in our runbook.",
  "KPI drill-down answered my question in two clicks.",
  "Is liquidity locked on-chain for this ticker?",
] as const

/** Deterministic remix/comment entries for author profiles. */
export function mockAuthorExcerpts(
  handle: string,
  pool: string[],
  kind: "remix" | "comment",
  count: number,
): ProfileMockActivityEntry[] {
  if (pool.length === 0) return []
  const excerpts = kind === "remix" ? REMIX_EXCERPT_POOL : COMMENT_EXCERPT_POOL
  const out: ProfileMockActivityEntry[] = []
  const used = new Set<number>()
  for (let i = 0; out.length < Math.min(count, pool.length) && i < pool.length * 4; i++) {
    const seed = `${handle}:${kind}:${i}`
    const idx = hashStr(seed) % pool.length
    if (used.has(idx)) continue
    used.add(idx)
    const excerpt = excerpts[hashStr(`${seed}|ex`) % excerpts.length]!
    const ageHours = (hashStr(`${seed}|age`) % 168) + 1
    out.push({
      postId: pool[idx]!,
      at: NOW - ageHours * HOUR,
      excerpt,
    })
  }
  return out
}

/**
 * Real counts where derivable from the feed, stable mock counts otherwise.
 * `fallback` is used for the viewer, where counts don't live in `feed`.
 */
export function computeProfileStats(
  handle: string | null,
  feed: GlobalFeedItem[],
  fallback?: { apps?: number; upvotesReceived?: number; comments?: number },
): ProfileStats {
  let apps = 0
  let upvotes = 0
  let comments = 0
  if (handle != null) {
    for (const item of feed) {
      if (item.builder === handle) {
        apps++
        upvotes += item.score
      }
      for (const c of item.initialComments) {
        if (c.author === handle) comments++
      }
    }
  } else {
    apps = fallback?.apps ?? 0
    upvotes = fallback?.upvotesReceived ?? 0
    comments = fallback?.comments ?? 0
  }
  const salt = hashStr(`stats:${handle ?? "viewer"}`)
  return {
    apps,
    upvotesReceived: upvotes,
    remixes: (salt % 18) + 3,
    comments,
    followers: ((salt >>> 8) % 4000) + 20,
    following: ((salt >>> 4) % 300) + 12,
  }
}

/** Feed post ids from `INITIAL_ACTIVITY_FEED` — viewer fallback when nothing voted. */
export const MOCK_PROFILE_UPVOTE_IDS: string[] = [
  "feed-p-per-blue-f1",
  "feed-p-jaja-research-f1",
  "feed-p-greenwood-f1",
  "feed-p-per-blue-f3",
]

export const MOCK_PROFILE_DOWNVOTE_IDS: string[] = [
  "feed-p-per-blue-f5",
  "feed-p-greenwood-f2",
]

export const MOCK_PROFILE_CREATED: MockProfileCreatedRow[] = [
  { id: "feed-p-per-blue-f2", title: "Lumen — tighter pricing grid" },
  { id: "feed-p-jaja-research-f2", title: "Llamaland" },
]

export const MOCK_PROFILE_REMIXES: ProfileMockActivityEntry[] = [
  {
    postId: "feed-p-per-blue-f4",
    at: NOW - DAY * 2 - HOUR * 3,
    excerpt: "Strip the hero to one headline and a single CTA.",
  },
  {
    postId: "feed-p-jaja-research-f1",
    at: NOW - DAY - HOUR * 8,
    excerpt: "Borrow the cohort chart for a weekly email digest.",
  },
  {
    postId: "feed-p-greenwood-f1",
    at: NOW - DAY * 5 - HOUR,
    excerpt: "Roll the floor-depth panel into our live preview.",
  },
]

export const MOCK_PROFILE_COMMENTS: ProfileMockActivityEntry[] = [
  {
    postId: "feed-p-jaja-research-f1",
    at: NOW - HOUR * 6,
    excerpt: "Price action looks fair; might park bids on this listing.",
  },
  {
    postId: "feed-p-per-blue-f6",
    at: NOW - DAY * 3 - HOUR * 2,
    excerpt: "Any chance we expose webhooks for checkout events?",
  },
  {
    postId: "feed-p-greenwood-f2",
    at: NOW - DAY * 7 - HOUR * 4,
    excerpt: "KPI drill-down answered my question in two clicks.",
  },
]
