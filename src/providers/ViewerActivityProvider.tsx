/* eslint-disable react-refresh/only-export-components -- app-wide viewer activity */
import React from "react"

export type ViewerFeedVote = "up" | "down" | null

export type ViewerActivityEntry = {
  postId: string
  at: number
  excerpt: string
}

type ViewerActivityContextValue = {
  feedVotes: Record<string, ViewerFeedVote>
  toggleFeedVote: (postId: string, direction: "up" | "down") => void
  commentActivity: ViewerActivityEntry[]
  remixActivity: ViewerActivityEntry[]
  recordFeedComment: (postId: string, excerpt: string) => void
  recordRemixIdea: (postId: string, idea: string) => void
}

const ViewerActivityContext = React.createContext<ViewerActivityContextValue | null>(
  null,
)

export function useViewerActivity(): ViewerActivityContextValue {
  const v = React.useContext(ViewerActivityContext)
  if (!v) {
    throw new Error("useViewerActivity must be used within ViewerActivityProvider")
  }
  return v
}

const MAX_LOG = 80

export function ViewerActivityProvider({ children }: { children: React.ReactNode }) {
  const [feedVotes, setFeedVotes] = React.useState<Record<string, ViewerFeedVote>>({})
  const [commentActivity, setCommentActivity] = React.useState<ViewerActivityEntry[]>(
    [],
  )
  const [remixActivity, setRemixActivity] = React.useState<ViewerActivityEntry[]>([])

  const toggleFeedVote = React.useCallback((postId: string, direction: "up" | "down") => {
    setFeedVotes((prev) => {
      const cur = prev[postId] ?? null
      const next: ViewerFeedVote = cur === direction ? null : direction
      return { ...prev, [postId]: next }
    })
  }, [])

  const recordFeedComment = React.useCallback((postId: string, excerpt: string) => {
    const trimmed = excerpt.trim().slice(0, 160)
    if (!trimmed) return
    setCommentActivity((prev) =>
      [{ postId, at: Date.now(), excerpt: trimmed }, ...prev].slice(0, MAX_LOG),
    )
  }, [])

  const recordRemixIdea = React.useCallback((postId: string, idea: string) => {
    const trimmed = idea.trim().slice(0, 160)
    if (!trimmed) return
    setRemixActivity((prev) =>
      [{ postId, at: Date.now(), excerpt: trimmed }, ...prev].slice(0, MAX_LOG),
    )
  }, [])

  const value = React.useMemo<ViewerActivityContextValue>(
    () => ({
      feedVotes,
      toggleFeedVote,
      commentActivity,
      remixActivity,
      recordFeedComment,
      recordRemixIdea,
    }),
    [
      feedVotes,
      toggleFeedVote,
      commentActivity,
      remixActivity,
      recordFeedComment,
      recordRemixIdea,
    ],
  )

  return (
    <ViewerActivityContext.Provider value={value}>{children}</ViewerActivityContext.Provider>
  )
}
