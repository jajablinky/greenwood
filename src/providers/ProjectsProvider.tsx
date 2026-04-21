/* eslint-disable react-refresh/only-export-components -- app-wide projects context */
import React from "react"

import type { ProjectRunStatus } from "components/atoms/ProjectStatusPill"
import { APP_MOCK_ONLY } from "helpers/app-mode"
import type { GlobalFeedItem } from "helpers/activity-feed-mock-data"
import type { MockTraceEntry } from "helpers/mock-agent-trace"
import {
  runMockWorkspaceAgentSequence,
  type MockAgentPhase,
} from "helpers/mock-workspace-agent-turn"
import {
  globalFeedItemFromWorkspace,
  ouroFeedIdForSlug,
} from "helpers/ouro-feed-items"
import type { WorkspaceSnapshot } from "helpers/ouroboros/types"
import { subscribeWorkspaceEvents, type WorkspaceEventPayload } from "helpers/ouroboros/events"
import { useToaster } from "providers/ToasterProvider"

type ProjectsContextValue = {
  ouroFeedItems: GlobalFeedItem[]
  snapshotsBySlug: Record<string, WorkspaceSnapshot>
  projectStatus: Record<string, ProjectRunStatus>
  thoughtLogBySlug: Record<string, string[]>
  addWorkspace: (snapshot: WorkspaceSnapshot) => void
  getStatusForSlug: (slug: string | undefined) => ProjectRunStatus | undefined
  getThoughtLog: (slug: string | undefined) => string[]
  getMockAgentTrace: (slug: string | undefined) => MockTraceEntry[]
  getMockAgentPhase: (slug: string | undefined) => MockAgentPhase | undefined
  getMockExploredFiles: (slug: string | undefined) => string[]
  runMockAgentTurn: (
    slug: string,
    userMessage: string,
    appName: string,
    onAssistantMessage: (body: string) => void,
  ) => Promise<void>
}

const ProjectsContext = React.createContext<ProjectsContextValue | null>(null)

export function useProjects(): ProjectsContextValue {
  const v = React.useContext(ProjectsContext)
  if (!v) {
    throw new Error("useProjects must be used within ProjectsProvider")
  }
  return v
}

function getMemberStatus(data: WorkspaceEventPayload): string | undefined {
  const m = data as { status?: string; role?: string }
  if (typeof m.status === "string") return m.status
  return undefined
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { push } = useToaster()
  const [ouroFeedItems, setOuroFeedItems] = React.useState<GlobalFeedItem[]>([])
  const [snapshotsBySlug, setSnapshotsBySlug] = React.useState<Record<string, WorkspaceSnapshot>>({})
  const [projectStatus, setProjectStatus] = React.useState<Record<string, ProjectRunStatus>>({})
  const [thoughtLogBySlug, setThoughtLogBySlug] = React.useState<Record<string, string[]>>({})
  const [mockAgentPhaseBySlug, setMockAgentPhaseBySlug] = React.useState<
    Record<string, MockAgentPhase>
  >({})
  const [mockExploredFilesBySlug, setMockExploredFilesBySlug] = React.useState<
    Record<string, string[]>
  >({})
  const [mockAgentTraceBySlug, setMockAgentTraceBySlug] = React.useState<
    Record<string, MockTraceEntry[]>
  >({})
  const subsRef = React.useRef<Map<string, () => void>>(new Map())

  const appendThought = React.useCallback((slug: string, line: string) => {
    if (!line.trim()) return
    setThoughtLogBySlug((prev) => ({
      ...prev,
      [slug]: [...(prev[slug] ?? []), line].slice(-200),
    }))
  }, [])

  const ensureSubscribed = React.useCallback(
    (slug: string, displayName: string) => {
      if (APP_MOCK_ONLY) return
      if (subsRef.current.has(slug)) return

      const off = subscribeWorkspaceEvents(slug, {
        "member.updated": (data) => {
          const role = (data as { role?: string }).role
          if (role !== "team_lead") return
          const st = getMemberStatus(data)
          if (st === "stuck") {
            setProjectStatus((prev) => ({ ...prev, [slug]: "stuck" }))
            push({
              variant: "warning",
              title: "Team lead stuck",
              body: `${displayName} — check Ouroboros or resume the member.`,
            })
          } else if (st === "idle" || st === "running") {
            setProjectStatus((prev) => ({
              ...prev,
              [slug]: st === "running" ? "running" : prev[slug] ?? "idle",
            }))
          }
        },
        "thought.delta": (data) => {
          const d = data as {
            text?: string
            done?: boolean
            member_id?: string
          }
          if (typeof d.text === "string" && d.text.length > 0) {
            appendThought(slug, d.text)
            setProjectStatus((prev) => ({ ...prev, [slug]: "running" }))
          }
          if (d.done === true) {
            setProjectStatus((prev) => ({ ...prev, [slug]: "done" }))
            push({
              variant: "success",
              title: "Agent finished a thought stream",
              body: displayName,
            })
          }
        },
      })
      subsRef.current.set(slug, off)
    },
    [appendThought, push],
  )

  const addWorkspace = React.useCallback(
    (snapshot: WorkspaceSnapshot) => {
      const { workspace } = snapshot
      const slug = workspace.slug
      setSnapshotsBySlug((prev) => ({ ...prev, [slug]: snapshot }))
      setOuroFeedItems((prev) => {
        const item = globalFeedItemFromWorkspace(workspace)
        const next = prev.filter((i) => i.id !== item.id)
        return [item, ...next]
      })
      setProjectStatus((prev) => ({ ...prev, [slug]: "starting" }))
      ensureSubscribed(slug, workspace.name)
      window.setTimeout(() => {
        setProjectStatus((prev) =>
          prev[slug] === "starting" ? { ...prev, [slug]: "running" } : prev,
        )
      }, 800)
    },
    [ensureSubscribed],
  )

  React.useEffect(() => {
    const ref = subsRef
    return () => {
      const subs = ref.current
      for (const off of subs.values()) {
        off()
      }
      subs.clear()
    }
  }, [])

  const getStatusForSlug = React.useCallback(
    (slug: string | undefined) => (slug ? projectStatus[slug] : undefined),
    [projectStatus],
  )

  const getThoughtLog = React.useCallback(
    (slug: string | undefined) => (slug ? thoughtLogBySlug[slug] ?? [] : []),
    [thoughtLogBySlug],
  )

  const clearMockTrace = React.useCallback((slug: string) => {
    setMockAgentTraceBySlug((prev) => ({ ...prev, [slug]: [] }))
  }, [])

  const pushMockTrace = React.useCallback((slug: string, entry: MockTraceEntry) => {
    setMockAgentTraceBySlug((prev) => ({
      ...prev,
      [slug]: [...(prev[slug] ?? []), entry].slice(-200),
    }))
  }, [])

  const getMockAgentTrace = React.useCallback(
    (slug: string | undefined) =>
      slug ? mockAgentTraceBySlug[slug] ?? [] : [],
    [mockAgentTraceBySlug],
  )

  const getMockAgentPhase = React.useCallback(
    (slug: string | undefined) =>
      slug ? mockAgentPhaseBySlug[slug] : undefined,
    [mockAgentPhaseBySlug],
  )

  const getMockExploredFiles = React.useCallback(
    (slug: string | undefined) =>
      slug ? mockExploredFilesBySlug[slug] ?? [] : [],
    [mockExploredFilesBySlug],
  )

  const updateOuroFeedItemPreview = React.useCallback(
    (slug: string, previewHtml: string) => {
      const id = ouroFeedIdForSlug(slug)
      setOuroFeedItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, previewHtml } : item)),
      )
    },
    [],
  )

  const runMockAgentTurn = React.useCallback(
    async (
      slug: string,
      userMessage: string,
      appName: string,
      onAssistantMessage: (body: string) => void,
    ) => {
      if (!APP_MOCK_ONLY) {
        return
      }
      await runMockWorkspaceAgentSequence({
        slug,
        userMessage,
        appName,
        setPhase: (s, phase) =>
          setMockAgentPhaseBySlug((prev) => ({ ...prev, [s]: phase })),
        clearTrace: clearMockTrace,
        clearFiles: (s) =>
          setMockExploredFilesBySlug((prev) => ({ ...prev, [s]: [] })),
        pushFile: (s, path) =>
          setMockExploredFilesBySlug((prev) => ({
            ...prev,
            [s]: [...(prev[s] ?? []), path],
          })),
        pushTrace: pushMockTrace,
        updatePreview: updateOuroFeedItemPreview,
        onAssistantMessage,
      })
    },
    [clearMockTrace, pushMockTrace, updateOuroFeedItemPreview],
  )

  const value = React.useMemo<ProjectsContextValue>(
    () => ({
      ouroFeedItems,
      snapshotsBySlug,
      projectStatus,
      thoughtLogBySlug,
      addWorkspace,
      getStatusForSlug,
      getThoughtLog,
      getMockAgentTrace,
      getMockAgentPhase,
      getMockExploredFiles,
      runMockAgentTurn,
    }),
    [
      ouroFeedItems,
      snapshotsBySlug,
      projectStatus,
      thoughtLogBySlug,
      addWorkspace,
      getStatusForSlug,
      getThoughtLog,
      getMockAgentTrace,
      getMockAgentPhase,
      getMockExploredFiles,
      runMockAgentTurn,
    ],
  )

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}
