/* eslint-disable react-refresh/only-export-components -- app-wide projects context */
import React from "react"

import type { ProjectRunStatus } from "components/atoms/ProjectStatusPill"
import type { GlobalFeedItem } from "helpers/activity-feed-mock-data"
import { globalFeedItemFromWorkspace } from "helpers/ouro-feed-items"
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

  const value = React.useMemo<ProjectsContextValue>(
    () => ({
      ouroFeedItems,
      snapshotsBySlug,
      projectStatus,
      thoughtLogBySlug,
      addWorkspace,
      getStatusForSlug,
      getThoughtLog,
    }),
    [
      ouroFeedItems,
      snapshotsBySlug,
      projectStatus,
      thoughtLogBySlug,
      addWorkspace,
      getStatusForSlug,
      getThoughtLog,
    ],
  )

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}
