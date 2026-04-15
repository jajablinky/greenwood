import { INITIAL_PROTOCOLS, type Protocol } from "@/lib/greenwood-mock-data"
import { toAppRouteName } from "@/lib/app-route-name"
import {
  buildBazarStylePreviewHtml,
  buildLlamalandGamePreviewHtml,
  buildMiniAppPreviewHtml,
} from "@/lib/feed-mini-app-previews"

export type FeedComment = {
  id: string
  author: string
  authorInitials: string
  body: string
  createdAt: number
  /** Mock: how the current viewer voted on this comment (read-only in UI). */
  viewerVote: "up" | "down" | null
}

/** Mock row for “remixes of this app” in the feed Open dialog and detail sidebar. */
export type FeedRemixListEntry = {
  id: string
  title: string
  author: string
  authorInitials: string
  createdAt: number
  /** Mock community votes for this remix fork. */
  score: number
  previewHtml: string
}

export type GlobalFeedItem = {
  id: string
  appSlug: string
  appName: string
  /** When set, overrides the main card title link text (studio route still uses `appName`). */
  cardTitle?: string
  forkId: string
  /** Mock on-chain tx / deployment ref shown in the metadata row. */
  transactionId: string
  detail: string
  builder: string
  builderInitials: string
  createdAt: number
  /** Community score before the current viewer’s vote. */
  score: number
  /** Full HTML document for a sandboxed preview iframe. */
  previewHtml: string
  /** Listed price (mock), numeric string shown as `$…`. */
  tokenPrice: string
  /** 24h-style move, e.g. `+5.5%`. */
  priceChangePct: string
  /** Abbreviated mock market cap, e.g. `1.1b`. */
  marketCapLabel: string
  initialComments: FeedComment[]
}

const BUILDERS: { name: string; initials: string }[] = [
  { name: "sam_kim", initials: "SK" },
  { name: "ninaalvarez", initials: "NA" },
  { name: "marcus_webb", initials: "MW" },
  { name: "devon_choi", initials: "DC" },
  { name: "priya_shah", initials: "PS" },
]

const COMMENT_TEMPLATES = [
  "Floor looks thin above this listing — still aped a little.",
  "Is liquidity locked on-chain for this ticker?",
  "Remixed the checkout flow; paid the mint in AR.",
  "Chart matches what we see in the live preview iframe.",
]

const TOKEN_PRICES: readonly string[] = [
  "0.024",
  "0.18",
  "1.42",
  "0.00091",
  "4.07",
  "0.63",
  "12.80",
  "0.0055",
  "0.88",
  "2.31",
  "0.0042",
  "48.20",
]

const PRICE_CHANGE_PCTS: readonly string[] = [
  "+5.5%",
  "+1.2%",
  "-0.8%",
  "+12.3%",
  "-2.1%",
  "+0.04%",
  "-5.9%",
  "+8.0%",
  "+2.2%",
  "-1.4%",
  "+0.9%",
  "+3.6%",
  "-0.3%",
]

const MARKET_CAP_LABELS: readonly string[] = [
  "78k",
  "890k",
  "2.4m",
  "12m",
  "48m",
  "320m",
  "960m",
  "1.1b",
  "3.8b",
  "6.2b",
]

function stablePick<T>(key: string, list: readonly T[]): T {
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0
  }
  return list[h % list.length]!
}

function mockTransactionId(forkId: string): string {
  let h = 0
  for (let i = 0; i < forkId.length; i++) {
    h = (h * 31 + forkId.charCodeAt(i)) >>> 0
  }
  const head = (h >>> 0).toString(16).padStart(8, "0").slice(0, 8)
  const tail = (h >>> 12).toString(16).padStart(4, "0").slice(0, 4)
  return `0x${head}…${tail}`
}

function seedCommentsForFork(forkId: string, forkCreatedAt: number): FeedComment[] {
  const n = stablePick(forkId, [0, 1, 2, 2, 3] as const)
  const out: FeedComment[] = []
  for (let i = 0; i < n; i++) {
    const b =
      BUILDERS[
        (i + stablePick(`${forkId}-ci`, [0, 1, 2, 3, 4] as const)) % BUILDERS.length
      ]!
    out.push({
      id: `${forkId}-c-${i}`,
      author: b.name,
      authorInitials: b.initials,
      body: COMMENT_TEMPLATES[(i + forkId.length) % COMMENT_TEMPLATES.length]!,
      createdAt: forkCreatedAt + 120_000 * (i + 1),
      viewerVote: stablePick(`${forkId}-vote-${i}`, [
        "up",
        "down",
        null,
      ] as const),
    })
  }
  return out
}

const REMIX_TITLE_SEEDS = [
  "Dark mode shell + AR pricing row",
  "Checkout flow; paid mint in AR",
  "KPI boards with venue drill-down",
  "Live preview iframe parity pass",
  "Bazar listing chrome + media grid",
  "Auth gate + guest read-only path",
  "Floor depth chart + liquidity notes",
]

export function mockRemixListForItem(
  item: Pick<GlobalFeedItem, "id" | "forkId" | "createdAt" | "appName">
): FeedRemixListEntry[] {
  const count = stablePick(`${item.forkId}\0rxlist`, [2, 3, 4, 5, 6] as const)
  const rows = Array.from({ length: count }, (_, i) => {
    const b =
      BUILDERS[
        (i + stablePick(`${item.id}\0rxa`, [0, 1, 2, 3, 4] as const)) %
          BUILDERS.length
      ]!
    const id = `${item.forkId}-rx-${i}`
    return {
      id,
      title:
        REMIX_TITLE_SEEDS[
          (i + item.forkId.length + item.id.length) % REMIX_TITLE_SEEDS.length
        ]!,
      author: b.name,
      authorInitials: b.initials,
      createdAt: item.createdAt - (i + 1) * 2_340_000,
      score: stablePick(`${item.id}\0${i}\0rxscore`, [
        8, 12, 15, 19, 24, 28, 33, 41, 48, 52, 58, 64, 71, 79, 88, 94, 103, 112, 124,
        131, 142, 156,
      ]),
      previewHtml: buildMiniAppPreviewHtml(id, item.appName),
    }
  })
  return rows.sort((a, b) => b.score - a.score)
}

function scoreForFork(forkId: string): number {
  const base = stablePick(forkId, [12, 24, 31, 48, 55, 67, 72, 88, 91, 103, 120])
  return base
}

export function buildGlobalFeedFromProtocols(protocols: Protocol[]): GlobalFeedItem[] {
  const items: GlobalFeedItem[] = []
  for (const protocol of protocols) {
    for (const fork of protocol.forks) {
      const builder = stablePick(fork.id, BUILDERS)
      const appSlug = toAppRouteName(protocol.name)
      items.push({
        id: `feed-${fork.id}`,
        appSlug,
        appName: protocol.name,
        forkId: fork.id,
        transactionId: mockTransactionId(fork.id),
        detail: fork.preview,
        builder: builder.name,
        builderInitials: builder.initials,
        createdAt: fork.createdAt,
        score: scoreForFork(fork.id),
        previewHtml: buildMiniAppPreviewHtml(fork.id, protocol.name),
        tokenPrice: stablePick(`${fork.id}\0tp`, TOKEN_PRICES),
        priceChangePct: stablePick(`${fork.id}\0pc`, PRICE_CHANGE_PCTS),
        marketCapLabel: stablePick(`${fork.id}\0mc`, MARKET_CAP_LABELS),
        initialComments: seedCommentsForFork(fork.id, fork.createdAt),
      })
    }
  }
  return items.sort((a, b) => b.createdAt - a.createdAt)
}

/** Northwind protocol — feed previews use Bazar-style marketplace chrome. */
const NORTHWIND_FORK_PREFIX = "p-jaja-research"

export const INITIAL_ACTIVITY_FEED: GlobalFeedItem[] = (() => {
  const items = buildGlobalFeedFromProtocols(INITIAL_PROTOCOLS)
  return items.map((item) => {
    /** Second Northwind fork in data — show as separate game listing in the feed. */
    if (item.forkId === "p-jaja-research-f2") {
      const name = "Llamaland"
      return {
        ...item,
        appName: name,
        appSlug: toAppRouteName(name),
        previewHtml: buildLlamalandGamePreviewHtml(),
      }
    }
    if (item.forkId === "p-jaja-research-f1") {
      return {
        ...item,
        previewHtml: buildBazarStylePreviewHtml(item.appName),
        cardTitle: "Bazar",
      }
    }
    if (item.forkId.startsWith(NORTHWIND_FORK_PREFIX)) {
      return { ...item, previewHtml: buildBazarStylePreviewHtml(item.appName) }
    }
    return item
  })
})()

/** Mock URL for the full-size preview page (wire to real navigation when ready). */
export function mockPreviewPageUrl(
  item: Pick<GlobalFeedItem, "id" | "appSlug">
): string {
  if (item.id === "feed-p-jaja-research-f2") {
    return `https://preview.permaweb.example/apps/${item.appSlug}?from=feed&id=${encodeURIComponent(item.id)}`
  }
  if (item.id.startsWith(`feed-${NORTHWIND_FORK_PREFIX}`)) {
    return "https://bazar.arweave.net"
  }
  return `https://preview.permaweb.example/apps/${item.appSlug}?from=feed&id=${encodeURIComponent(item.id)}`
}
