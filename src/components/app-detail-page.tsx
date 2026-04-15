import { useMemo, useState, type FormEvent } from "react"
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react"
import { Link, Navigate, useParams } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { studioPathForProtocol } from "@/lib/app-route-name"
import {
  INITIAL_ACTIVITY_FEED,
  mockRemixListForItem,
  type FeedComment,
} from "@/lib/activity-feed-mock-data"
import { formatShortTimeAgo } from "@/lib/format-short-time-ago"
import { cn } from "@/lib/utils"

type ViewerVote = "up" | "down" | null

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return `${n}`
}

function newCommentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `detail-${crypto.randomUUID().slice(0, 8)}`
  }
  return `detail-${Date.now()}`
}

export function AppDetailPage() {
  const { feedId = "" } = useParams<{ feedId: string }>()
  const decodedId = decodeURIComponent(feedId)
  const item = INITIAL_ACTIVITY_FEED.find((x) => x.id === decodedId) ?? null

  const [vote, setVote] = useState<ViewerVote>(null)
  const [comments, setComments] = useState<FeedComment[]>(
    item?.initialComments ?? []
  )
  const [draft, setDraft] = useState("")

  const remixes = useMemo(() => {
    const found = INITIAL_ACTIVITY_FEED.find((x) => x.id === decodedId)
    if (!found) return []
    return mockRemixListForItem(found)
  }, [decodedId])

  if (!item) {
    return <Navigate to="/" replace />
  }

  const displayScore = item.score + (vote === "up" ? 1 : vote === "down" ? -1 : 0)
  const title = item.cardTitle ?? item.appName

  function toggleVote(direction: "up" | "down") {
    setVote((cur) => (cur === direction ? null : direction))
  }

  function submitComment(e: FormEvent) {
    e.preventDefault()
    const raw = draft.trim()
    if (!raw) return
    setComments((prev) => [
      ...prev,
      {
        id: newCommentId(),
        author: "you",
        authorInitials: "ME",
        body: raw,
        createdAt: Date.now(),
        viewerVote: null,
      },
    ])
    setDraft("")
  }

  return (
    <div className="min-h-svh bg-white text-foreground dark:bg-background">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/90 backdrop-blur-md dark:border-white/[0.08] dark:bg-background/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
          >
            <ArrowLeftIcon className="size-4" />
            Feed
          </Link>
          <span className="truncate text-sm text-muted-foreground">{title}</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0">
            <div className="relative overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.12]">
              <iframe
                title={`${item.appName} preview`}
                srcDoc={item.previewHtml}
                sandbox="allow-scripts"
                className="aspect-video block w-full border-0 bg-transparent"
              />
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-lg font-medium sm:text-xl">{title}</h1>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {item.builder} · {formatShortTimeAgo(item.createdAt)} · {item.transactionId}
                </p>
              </div>
              <div
                className="flex shrink-0 flex-row items-center gap-0 overflow-hidden rounded-full border border-black/[0.08] -space-x-1 sm:-space-x-1.5 dark:border-white/[0.12]"
                role="group"
                aria-label="Vote on this listing"
              >
                <button
                  type="button"
                  aria-label="Upvote"
                  aria-pressed={vote === "up"}
                  onClick={() => toggleVote("up")}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/[0.04] hover:text-foreground sm:size-10 dark:hover:bg-white/10",
                    vote === "up" && "text-alt-green-deep dark:text-alt-green-deep"
                  )}
                >
                  <ChevronUpIcon className="size-6 sm:size-7" strokeWidth={1.5} />
                </button>
                <span
                  className={cn(
                    "min-w-[2.1rem] px-0 text-center text-base font-medium tabular-nums leading-none sm:min-w-[2.4rem] sm:text-lg",
                    displayScore > 0 && "text-alt-green-deep dark:text-alt-green-deep",
                    displayScore < 0 && "text-alt-red-deep dark:text-alt-red-deep"
                  )}
                  title="Score"
                >
                  {formatCount(displayScore)}
                </span>
                <button
                  type="button"
                  aria-label="Downvote"
                  aria-pressed={vote === "down"}
                  onClick={() => toggleVote("down")}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/[0.04] hover:text-foreground sm:size-10 dark:hover:bg-white/10",
                    vote === "down" && "text-alt-red-deep dark:text-alt-red-deep"
                  )}
                >
                  <ChevronDownIcon className="size-6 sm:size-7" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <section className="mt-4">
              <h2 className="text-sm font-medium">{comments.length} comments</h2>
              <ul className="mt-3 space-y-3">
                {comments.map((c) => (
                  <li key={c.id} className="flex gap-2">
                    <Avatar className="size-7 shrink-0 rounded-md">
                      <AvatarFallback className="rounded-md text-[10px]">
                        {c.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{c.author}</span> ·{" "}
                        {formatShortTimeAgo(c.createdAt)}
                      </p>
                      <p className="text-sm text-foreground/90">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <form onSubmit={submitComment} className="mt-3 space-y-2">
                <label htmlFor="detail-comment" className="sr-only">
                  Add comment
                </label>
                <textarea
                  id="detail-comment"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder="Add a comment…"
                  className="w-full resize-y rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:border-white/[0.12] dark:bg-background"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm">
                    Comment
                  </Button>
                </div>
              </form>
            </section>
          </section>

          <aside className="min-w-0">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Remixes</h2>
            <ul className="space-y-2">
              {remixes.map((r) => (
                <li key={r.id}>
                  <Link
                    to={studioPathForProtocol(item.appName)}
                    className="flex gap-2 rounded-xl p-2 transition-colors hover:bg-muted/40 dark:hover:bg-muted/20"
                  >
                    <div className="w-36 shrink-0 overflow-hidden rounded-md">
                      <iframe
                        title={`Preview: ${r.title}`}
                        srcDoc={r.previewHtml}
                        sandbox="allow-scripts"
                        className="pointer-events-none block h-20 w-full border-0"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium leading-snug">{r.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/80">{r.author}</span>
                        <span aria-hidden> · </span>
                        {formatShortTimeAgo(r.createdAt)}
                      </p>
                      <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                        {formatCount(r.score)} votes
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  )
}
