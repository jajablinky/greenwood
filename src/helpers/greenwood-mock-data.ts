export type Fork = {
  id: string
  preview: string
  createdAt: number
}

/** In-app chat transcript (mock); keyed by fork id in App state. */
export type ThreadMessage =
  | { id: string; role: "user"; body: string }
  | {
      id: string
      role: "assistant"
      workedSeconds: number
      body: string
    }

const DEMO_ASSISTANT_REPLY = `The dev server is running.

http://localhost:3000/

I started it with \`npm run start:development\` from the project root. Press Ctrl+C in that terminal to stop it. If you need LAN access, rerun with \`--host\` so other devices on your network can open the URL.`

const FOLLOWUP_ASSISTANT_REPLY =
  "Thanks — I’ve logged that follow-up. When you’re ready, we can iterate on the next change or run checks against the dev server."

export function seedThreadFromFork(fork: Fork): ThreadMessage[] {
  return [
    {
      id: `${fork.id}-u0`,
      role: "user",
      body: fork.preview,
    },
    {
      id: `${fork.id}-a0`,
      role: "assistant",
      workedSeconds: 14,
      body: DEMO_ASSISTANT_REPLY,
    },
  ]
}

export function mockAssistantFollowUp(): ThreadMessage {
  return {
    id: `a-${Date.now()}`,
    role: "assistant",
    workedSeconds: 3,
    body: FOLLOWUP_ASSISTANT_REPLY,
  }
}

/** One timeline: all forks in a protocol, oldest → newest, for main transcript + scroll targets. */
export type MergedThreadMessage = ThreadMessage & { forkId: string }

export function buildMergedProtocolThread(
  protocol: Protocol,
  threads: Record<string, ThreadMessage[]>
): MergedThreadMessage[] {
  const sorted = [...protocol.forks].sort((a, b) => a.createdAt - b.createdAt)
  const out: MergedThreadMessage[] = []
  for (const f of sorted) {
    const segment = threads[f.id] ?? seedThreadFromFork(f)
    for (const m of segment) {
      out.push({ ...m, forkId: f.id })
    }
  }
  return out
}

export type Protocol = {
  id: string
  name: string
  forks: Fork[]
}

export type ConnectContentCategory =
  | "social"
  | "videos"
  | "images"
  | "text"
  | "protocol"

export type ConnectContentItem = {
  id: string
  title: string
  hint?: string
  category: ConnectContentCategory
  protocolId?: string
  protocolName?: string
}

const day = 86_400_000
const now = Date.now()

export const INITIAL_PROTOCOLS: Protocol[] = [
  {
    id: "p-per-blue",
    name: "Lumen — SaaS landing & checkout",
    forks: [
      {
        id: "p-per-blue-f1",
        preview:
          "Ship hero + pricing with Stripe Checkout links and annual toggle.",
        createdAt: now - day * 5,
      },
      {
        id: "p-per-blue-f2",
        preview:
          "Tighten mobile pricing grid; add SOC2 + GDPR badges above the fold.",
        createdAt: now - day * 4,
      },
      {
        id: "p-per-blue-f3",
        preview:
          "Replace carousel quotes with static logos + one-line case studies.",
        createdAt: now - day * 3,
      },
      {
        id: "p-per-blue-f4",
        preview:
          "Add live preview URL + changelog block for enterprise procurement.",
        createdAt: now - day * 2,
      },
      {
        id: "p-per-blue-f5",
        preview:
          "Fix secondary button contrast in dark mode; match WCAG AA on slate.",
        createdAt: now - day * 1.5,
      },
      {
        id: "p-per-blue-f6",
        preview:
          "Export design tokens for radii and spacing; wire into Tailwind theme.",
        createdAt: now - day * 1,
      },
      {
        id: "p-per-blue-f7",
        preview:
          "Hold launch: swap stock art for custom illustrations when brand lands.",
        createdAt: now - day * 0.5,
      },
    ],
  },
  {
    id: "p-jaja-research",
    name: "Northwind — analytics & KPI boards",
    forks: [
      {
        id: "p-jaja-research-f1",
        preview:
          "Rebuild exec overview: cohort retention, MRR bridge, and drill-down.",
        createdAt: now - 3600_000,
      },
      {
        id: "p-jaja-research-f2",
        preview:
          "Add saved views + Slack digests for spikes on error budget burn.",
        createdAt: now - 7200_000,
      },
    ],
  },
  {
    id: "p-greenwood",
    name: "Harbor — deploys & runbooks",
    forks: [
      {
        id: "p-greenwood-f1",
        preview:
          "Connect GitHub → preview envs; show diff + promote-to-prod button.",
        createdAt: now - 1800_000,
      },
      {
        id: "p-greenwood-f2",
        preview:
          "Polish incident timeline UI; link runbooks and owner on-call roster.",
        createdAt: now - 5400_000,
      },
    ],
  },
]

/** Browse / connect: mock permaweb-adjacent surfaces (filters in UI). */
export const CONNECT_CONTENT_ITEMS: ConnectContentItem[] = [
  {
    id: "cc-1",
    title: "ArNS profile stream",
    hint: "Identity + posts",
    category: "social",
    protocolId: "p-jaja-research",
    protocolName: "Northwind — analytics & KPI boards",
  },
  {
    id: "cc-2",
    title: "AO task monitor feed",
    hint: "Live ops",
    category: "protocol",
    protocolId: "p-greenwood",
    protocolName: "Harbor — deploys & runbooks",
  },
  {
    id: "cc-3",
    title: "Landing hero stills",
    hint: "PNG bundle",
    category: "images",
    protocolId: "p-per-blue",
    protocolName: "Lumen — SaaS landing & checkout",
  },
  {
    id: "cc-4",
    title: "Deploy walkthrough",
    hint: "5 min",
    category: "videos",
    protocolId: "p-greenwood",
    protocolName: "Harbor — deploys & runbooks",
  },
  {
    id: "cc-5",
    title: "Brand voice notes",
    hint: "Markdown",
    category: "text",
    protocolId: "p-per-blue",
    protocolName: "Lumen — SaaS landing & checkout",
  },
  {
    id: "cc-6",
    title: "Permaweb digest",
    hint: "Weekly",
    category: "social",
  },
  {
    id: "cc-7",
    title: "Token metadata images",
    hint: "Square crops",
    category: "images",
  },
  {
    id: "cc-8",
    title: "CLI screen capture",
    hint: "asciinema",
    category: "videos",
  },
  {
    id: "cc-9",
    title: "README + LICENSE",
    hint: "Plain text",
    category: "text",
  },
  {
    id: "cc-10",
    title: "SmartWeave reader",
    hint: "Legacy contract",
    category: "protocol",
  },
  {
    id: "cc-11",
    title: "Farcaster frame spec",
    hint: "Open graph",
    category: "social",
  },
  {
    id: "cc-12",
    title: "4K b-roll pack",
    hint: "Looped",
    category: "videos",
  },
]

export function findForkContext(
  protocols: Protocol[],
  forkId: string
): { protocol: Protocol; fork: Fork } | null {
  for (const protocol of protocols) {
    const fork = protocol.forks.find((f) => f.id === forkId)
    if (fork) {
      return { protocol, fork }
    }
  }
  return null
}

export function newProtocolId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `p-${crypto.randomUUID().slice(0, 8)}`
  }
  return `p-${Date.now()}`
}

export function newForkId(protocolId: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${protocolId}-f-${crypto.randomUUID().slice(0, 8)}`
  }
  return `${protocolId}-f-${Date.now()}`
}
