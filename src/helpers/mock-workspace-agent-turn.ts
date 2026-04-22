import type { MockTraceEntry } from "helpers/mock-agent-trace"
import { buildBazarStylePreviewHtmlAgentPatched } from "helpers/feed-mini-app-previews"

export type MockAgentPhase =
  | "idle"
  | "thinking"
  | "exploring"
  | "synthesizing"
  | "done"

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/**
 * Simulates team-lead reasoning, diffs, shell steps, assistant reply, and a patched preview bundle (mock only).
 */
export async function runMockWorkspaceAgentSequence(opts: {
  slug: string
  userMessage: string
  appName: string
  setPhase: (slug: string, phase: MockAgentPhase) => void
  clearTrace: (slug: string) => void
  clearFiles: (slug: string) => void
  pushFile: (slug: string, path: string) => void
  pushTrace: (slug: string, entry: MockTraceEntry) => void
  updatePreview: (slug: string, html: string) => void
  onAssistantMessage: (body: string) => void
}): Promise<void> {
  const {
    slug,
    userMessage,
    appName,
    setPhase,
    clearTrace,
    clearFiles,
    pushFile,
    pushTrace,
    updatePreview,
    onAssistantMessage,
  } = opts

  const hint =
    userMessage.length > 72 ? `${userMessage.slice(0, 70)}…` : userMessage

  clearTrace(slug)
  setPhase(slug, "thinking")
  clearFiles(slug)

  pushTrace(slug, {
    kind: "user_line",
    text: userMessage.slice(0, 280),
  })
  await sleep(420)
  pushTrace(slug, { kind: "thought_elapsed", text: "Thought for 5s" })
  await sleep(380)
  pushTrace(slug, { kind: "line", text: "Chat context summarized." })

  pushTrace(slug, {
    kind: "diff",
    file: "ProjectsProvider.tsx",
    additions: 4,
    deletions: 2,
    lines: [
      {
        kind: "context",
        text: `import { runMockWorkspaceAgentSequence } from "helpers/mock-workspace-agent-turn"`,
      },
      {
        kind: "add",
        text: `import type { MockTraceEntry } from "helpers/mock-agent-trace"`,
      },
      {
        kind: "add",
        text: `pushMockTrace(slug, entry)`,
      },
      {
        kind: "remove",
        text: `appendThought(slug, line)`,
      },
    ],
  })
  await sleep(360)

  pushTrace(slug, { kind: "thought_elapsed", text: "Thought briefly" })
  await sleep(280)

  pushTrace(slug, {
    kind: "diff",
    file: "index.tsx",
    additions: 1,
    deletions: 1,
    lines: [
      { kind: "remove", text: "if (!raw) return" },
      { kind: "add", text: "if (!raw || !item) return" },
    ],
  })
  await sleep(320)

  pushTrace(slug, {
    kind: "command",
    text: "> Verify full TypeScript build\ncd agent-orchestrator-neo-minimal && npm run build",
  })
  await sleep(400)

  setPhase(slug, "exploring")
  const files = [
    "workspace/ao-manifest.json",
    "src/permaweb/config.json",
    "agents/team-lead.md",
    "src/views/AppDetail/index.tsx",
    "specs/ROUTES.md",
  ]
  for (const f of files) {
    pushFile(slug, f)
  }

  const exploreItems = [
    ...files.map((f) => `↳ Open ${f}`),
    "↳ Explored lints",
  ]
  pushTrace(slug, {
    kind: "explore_block",
    fileCount: files.length,
    searchCount: 1,
    items: exploreItems,
  })
  await sleep(380)

  setPhase(slug, "synthesizing")
  pushTrace(slug, {
    kind: "command",
    text: "> Verify build after null guard\nnpm run build",
  })
  await sleep(380)

  pushTrace(slug, { kind: "line", text: "Here is what was left and what I did." })
  await sleep(280)

  const reply = `Fix
submitComposer could still see item as possibly null when passing item.appName into runMockAgentTurn (TS18047). The page redirects when !item, but TypeScript does not narrow inside the async callback.

Guard the composer before use:

if (!raw || !item) return

Status
• npm run build completes (tsc + Vite)
• No new linter issues on AppDetail/index.tsx

What you have now (mock flow)
With APP_MOCK_ONLY and this Ouro detail in comment mode: Enter sends your prompt, the trace shows timing chips, inline diffs, and command blocks, then a team lead reply lands in the thread and the preview iframe hot-reloads the patched Bazar-style bundle for ${appName}.`

  onAssistantMessage(reply)

  updatePreview(slug, buildBazarStylePreviewHtmlAgentPatched(appName, hint))

  setPhase(slug, "done")
  pushTrace(slug, {
    kind: "line",
    text: "✓ Preview bundle synced. Workspace graph consistent.",
  })
  await sleep(400)
  setPhase(slug, "idle")
}
