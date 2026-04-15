import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react"
import {
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MousePointer2Icon,
  ShuffleIcon,
} from "lucide-react"
import { Link } from "react-router-dom"

import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { activityDetailPath, studioPathForProtocol } from "@/lib/app-route-name"
import {
  INITIAL_ACTIVITY_FEED,
  mockRemixListForItem,
  type FeedComment,
  type GlobalFeedItem,
} from "@/lib/activity-feed-mock-data"
import { formatShortTimeAgo } from "@/lib/format-short-time-ago"
import { cn } from "@/lib/utils"

type ViewerVote = "up" | "down" | null

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return `${n}`
}

function priceChangeToneClass(change: string): string {
  if (change.startsWith("+")) return "text-alt-green-deep dark:text-alt-green-lime"
  if (change.startsWith("-")) return "text-alt-red-deep dark:text-alt-red-smooth"
  return "text-muted-foreground"
}

function FeedPriceCaption({
  priceChangePct,
  marketCapLabel,
  variant = "default",
}: Pick<GlobalFeedItem, "priceChangePct" | "marketCapLabel"> & {
  variant?: "default" | "inline"
}) {
  const inline = variant === "inline"
  return (
    <p
      className={cn(
        "flex min-w-0 flex-nowrap items-baseline justify-start text-left",
        inline
          ? "shrink-0 gap-x-1 text-foreground sm:gap-x-1.5"
          : "shrink-0 gap-x-2 sm:gap-x-2.5"
      )}
    >
      <span
        className={cn(
          "inline-flex items-baseline font-medium tabular-nums text-foreground",
          inline
            ? "gap-0.5 text-[11px] sm:text-xs"
            : "gap-0.5 text-xs sm:gap-1 sm:text-base"
        )}
      >
        <abbr
          title="Market cap"
          className="cursor-default font-medium no-underline"
        >
          MC
        </abbr>
        ${marketCapLabel}
      </span>
      <span
        className={cn(
          "font-medium tabular-nums leading-none",
          inline ? "text-[10px] sm:text-[11px]" : "text-[11px] sm:text-sm",
          priceChangeToneClass(priceChangePct)
        )}
      >
        {priceChangePct}
      </span>
    </p>
  )
}

function newCommentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `me-${crypto.randomUUID().slice(0, 8)}`
  }
  return `me-${Date.now()}`
}

function isRemixCommentBody(body: string): boolean {
  return body.startsWith("Remix:")
}

function hotScore(item: GlobalFeedItem, viewerDelta: number): number {
  const hours = Math.max(1, (Date.now() - item.createdAt) / 3_600_000)
  return (item.score + viewerDelta) / Math.pow(hours + 2, 1.5)
}

export function ActivityFeedPage() {
  const [votes, setVotes] = useState<Record<string, ViewerVote>>({})
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, FeedComment[]>
  >(() =>
    Object.fromEntries(INITIAL_ACTIVITY_FEED.map((i) => [i.id, i.initialComments]))
  )
  const [openThread, setOpenThread] = useState<Record<string, boolean>>({})
  const [draftByPost, setDraftByPost] = useState<Record<string, string>>({})
  const [remixText, setRemixText] = useState("")
  /** Feed row remix control opens a dialog: fork list + compose. */
  const [remixListPostId, setRemixListPostId] = useState<string | null>(null)
  const remixInputRef = useRef<HTMLTextAreaElement>(null)
  /** Scroll + ring a specific comment (e.g. after remix, or “Open in thread”). */
  const [highlightComment, setHighlightComment] = useState<{
    postId: string
    commentId: string
  } | null>(null)

  useEffect(() => {
    if (!highlightComment) {
      return
    }
    const { postId, commentId } = highlightComment
    if (openThread[postId] !== true) {
      const drop = window.setTimeout(() => setHighlightComment(null), 0)
      return () => window.clearTimeout(drop)
    }
    const elId = `feed-comment-${postId}-${commentId}`
    const tScroll = window.setTimeout(() => {
      document.getElementById(elId)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 0)
    const tClear = window.setTimeout(() => {
      setHighlightComment(null)
    }, 3200)
    return () => {
      window.clearTimeout(tScroll)
      window.clearTimeout(tClear)
    }
  }, [highlightComment, openThread])

  useEffect(() => {
    if (!remixListPostId) {
      return
    }
    const t = window.setTimeout(() => remixInputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [remixListPostId])

  const sortedFeed = useMemo(() => {
    const list = [...INITIAL_ACTIVITY_FEED]
    const viewerDelta = (id: string) =>
      votes[id] === "up" ? 1 : votes[id] === "down" ? -1 : 0

    list.sort(
      (a, b) =>
        hotScore(b, viewerDelta(b.id)) - hotScore(a, viewerDelta(a.id))
    )
    return list
  }, [votes])

  const remixListDialogItem = useMemo(
    () =>
      remixListPostId
        ? (sortedFeed.find((i) => i.id === remixListPostId) ?? null)
        : null,
    [remixListPostId, sortedFeed]
  )

  const toggleVote = useCallback(
    (postId: string, direction: "up" | "down") => {
      setVotes((prev) => {
        const cur = prev[postId] ?? null
        const next: ViewerVote =
          cur === direction ? null : direction
        return { ...prev, [postId]: next }
      })
    },
    []
  )

  const displayScore = useCallback(
    (item: GlobalFeedItem) => {
      const v = votes[item.id] ?? null
      const d = v === "up" ? 1 : v === "down" ? -1 : 0
      return item.score + d
    },
    [votes]
  )

  const submitComment = useCallback(
    (e: FormEvent, postId: string) => {
      e.preventDefault()
      const raw = (draftByPost[postId] ?? "").trim()
      if (!raw) {
        return
      }
      const row: FeedComment = {
        id: newCommentId(),
        author: "you",
        authorInitials: "ME",
        body: raw,
        createdAt: Date.now(),
        viewerVote: null,
      }
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), row],
      }))
      setDraftByPost((prev) => ({ ...prev, [postId]: "" }))
      setOpenThread((prev) => ({ ...prev, [postId]: true }))
    },
    [draftByPost]
  )

  const submitRemixIdea = useCallback(
    (postId: string) => {
      const raw = remixText.trim()
      if (!raw) {
        return
      }
      const row: FeedComment = {
        id: newCommentId(),
        author: "you",
        authorInitials: "ME",
        body: `Remix: ${raw}`,
        createdAt: Date.now(),
        viewerVote: null,
      }
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), row],
      }))
      setRemixListPostId(null)
      setRemixText("")
      setOpenThread((prev) => ({ ...prev, [postId]: true }))
      setHighlightComment({ postId, commentId: row.id })
    },
    [remixText]
  )

  return (
    <div className="min-h-svh bg-white text-foreground dark:bg-background">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/90 backdrop-blur-md dark:border-white/[0.08] dark:bg-background/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <div className="min-w-0">
            <Link
              to="/"
              className="block truncate text-sm font-medium tracking-tight text-foreground"
            >
              PermawebOS
            </Link>
          </div>
          <div className="flex shrink-0 items-center">
            <ConnectWalletButton />
            {/* <Link
              to="/studio"
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full no-underline"
              )}
            >
              Open studio
            </Link> */}
          </div>
        </div>
      </header>

      <main className="relative z-0 mx-auto max-w-3xl px-0 pb-16 pt-1.5 sm:px-6 sm:pt-3">
        <ol className="space-y-10 sm:space-y-14">
          {sortedFeed.map((item) => {
            const v = votes[item.id] ?? null
            const score = displayScore(item)
            const comments = commentsByPost[item.id] ?? []
            const open = openThread[item.id] === true
            const studioHref = studioPathForProtocol(item.appName)
            const detailHref = activityDetailPath(item.id)
            const remixListCount = mockRemixListForItem(item).length
            const cardTitle = item.cardTitle ?? item.appName

            return (
              <li key={item.id}>
                <article className="flex flex-col gap-0">
                  <div
                    className="relative w-full"
                    aria-label={`${item.appName} live HTML preview`}
                    role="group"
                  >
                    <div className="relative min-h-[80px] overflow-hidden rounded-xl">
                      <iframe
                        title={`${item.appName} preview`}
                        srcDoc={item.previewHtml}
                        sandbox="allow-scripts"
                        className="pointer-events-none aspect-video block w-full min-h-[120px] border-0 bg-transparent"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <Link
                        to={detailHref}
                        className="absolute inset-0 z-10 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                        aria-label={`Open ${item.appName} detail page`}
                        title={`Open ${item.appName} detail page`}
                      />
                    </div>
                  </div>

                  <div className="px-3 py-3 sm:px-0 sm:py-4">
                    <div className="flex items-stretch justify-between gap-2 sm:gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
                        <Avatar
                          className="aspect-square size-8 shrink-0 rounded-full after:rounded-full sm:size-9"
                          aria-label={item.builder}
                          title={item.builder}
                        >
                          <AvatarFallback className="rounded-[inherit] text-xs font-medium">
                            {item.builderInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 flex-nowrap items-center gap-x-1.5 overflow-hidden text-[11px] text-muted-foreground sm:gap-x-2 sm:text-xs">
                            <span className="shrink-0 font-medium text-foreground/80">
                              {item.builder}
                            </span>
                            <span className="shrink-0" aria-hidden>
                              ·
                            </span>
                            <span
                              className="shrink-0"
                              title={new Date(item.createdAt).toLocaleString()}
                            >
                              {formatShortTimeAgo(item.createdAt)}
                            </span>
                            <span className="shrink-0" aria-hidden>
                              ·
                            </span>
                            <FeedPriceCaption
                              variant="inline"
                              priceChangePct={item.priceChangePct}
                              marketCapLabel={item.marketCapLabel}
                            />
                            <span className="hidden shrink-0 sm:inline" aria-hidden>
                              ·
                            </span>
                            <span
                              className="hidden min-w-0 truncate font-mono tabular-nums sm:inline"
                              title={item.transactionId}
                            >
                              {item.transactionId}
                            </span>
                          </div>

                          <h2 className="text-[15px] font-medium leading-snug sm:text-base">
                            <Link
                              to={detailHref}
                              className="text-foreground underline-offset-2 hover:underline"
                              aria-label={`Open ${cardTitle} detail page`}
                            >
                              {cardTitle}
                            </Link>
                          </h2>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-nowrap items-center gap-1.5 self-center">
                        <div
                          className="flex min-w-0 shrink-0 items-stretch overflow-hidden rounded-full border border-black/[0.08] dark:border-white/[0.12]"
                          role="group"
                          aria-label="Comments and remixes"
                        >
                          <Link
                            to={detailHref}
                            title={`${comments.length} ${comments.length === 1 ? "comment" : "comments"} — open detail`}
                            aria-label={`Open ${cardTitle} detail — ${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "sm" }),
                              "h-8 shrink-0 gap-1.5 rounded-none rounded-l-full border-0 px-2.5 text-muted-foreground hover:text-foreground",
                              "inline-flex items-center justify-center no-underline"
                            )}
                          >
                            <MessageSquareIcon className="size-4 shrink-0" aria-hidden />
                            <span className="tabular-nums">
                              {comments.length > 99 ? "99+" : comments.length}{" "}
                              {comments.length === 1 ? "comment" : "comments"}
                            </span>
                          </Link>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            title={`${remixListCount} remixes — add idea or browse forks`}
                            aria-label={`Remix ${item.appName}: ${remixListCount} forks, open list and composer`}
                            aria-expanded={remixListPostId === item.id}
                            aria-haspopup="dialog"
                            className={cn(
                              "h-8 shrink-0 gap-1.5 rounded-none rounded-r-full border-0 border-l border-black/[0.08] px-2.5 text-muted-foreground hover:text-foreground dark:border-white/[0.12]",
                              remixListPostId === item.id &&
                                "bg-blue-50/60 text-foreground shadow-sm hover:bg-blue-50/80 dark:bg-blue-950/35 dark:hover:bg-blue-950/45"
                            )}
                            onClick={() => {
                              setRemixListPostId((cur) => {
                                if (cur === item.id) {
                                  setRemixText("")
                                  return null
                                }
                                setRemixText("")
                                return item.id
                              })
                            }}
                          >
                            <ShuffleIcon className="size-4 shrink-0" aria-hidden />
                            <span className="tabular-nums">
                              {remixListCount > 99 ? "99+" : remixListCount} Remix
                            </span>
                          </Button>
                        </div>
                        <div
                          className="flex shrink-0 flex-row items-center gap-0 overflow-hidden rounded-full border border-black/[0.08] -space-x-1 sm:-space-x-1.5 dark:border-white/[0.12]"
                          role="group"
                          aria-label="Vote on this listing"
                        >
                          <button
                            type="button"
                            aria-label="Upvote"
                            aria-pressed={v === "up"}
                            onClick={() => toggleVote(item.id, "up")}
                            className={cn(
                              "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/[0.04] hover:text-foreground sm:size-10 dark:hover:bg-white/10",
                              v === "up" && "text-alt-green-deep dark:text-alt-green-deep"
                            )}
                          >
                            <ChevronUpIcon className="size-6 sm:size-7" strokeWidth={1.5} />
                          </button>
                          <span
                            className={cn(
                              "min-w-[2.1rem] px-0 text-center text-base font-medium tabular-nums leading-none sm:min-w-[2.4rem] sm:text-lg",
                              score > 0 && "text-alt-green-deep dark:text-alt-green-deep",
                              score < 0 && "text-alt-red-deep dark:text-alt-red-deep"
                            )}
                            title="Score"
                          >
                            {formatCount(score)}
                          </span>
                          <button
                            type="button"
                            aria-label="Downvote"
                            aria-pressed={v === "down"}
                            onClick={() => toggleVote(item.id, "down")}
                            className={cn(
                              "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/[0.04] hover:text-foreground sm:size-10 dark:hover:bg-white/10",
                              v === "down" && "text-alt-red-deep dark:text-alt-red-deep"
                            )}
                          >
                            <ChevronDownIcon className="size-6 sm:size-7" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {open ? (
                    <div className="px-3 pb-3 sm:px-0 sm:pb-4">
                      <div className="mt-3 space-y-3 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]">
                        <ul className="space-y-3">
                          {comments.map((c) => {
                            const vv = c.viewerVote
                            const voteMark =
                              vv === "up" ? "+1" : vv === "down" ? "-1" : "0"
                            const voteAria =
                              vv === "up"
                                ? "You upvoted this comment"
                                : vv === "down"
                                  ? "You downvoted this comment"
                                  : "You have not voted on this comment"
                            return (
                            <li
                              key={c.id}
                              id={`feed-comment-${item.id}-${c.id}`}
                              className={cn(
                                "flex gap-2 rounded-lg px-1 py-0.5 transition-shadow",
                                highlightComment?.postId === item.id &&
                                  highlightComment.commentId === c.id &&
                                  "bg-sky-50/90 ring-2 ring-sky-400/50 ring-offset-2 ring-offset-background dark:bg-sky-950/40 dark:ring-sky-500/40"
                              )}
                            >
                              <Avatar className="size-7 shrink-0 rounded-md">
                                <AvatarFallback className="rounded-md text-[10px]">
                                  {c.authorInitials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs">
                                    <span className="font-medium text-foreground">
                                      {c.author}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {formatShortTimeAgo(c.createdAt)}
                                    </span>
                                  </div>
                                  <span
                                    className={cn(
                                      "shrink-0 text-xs font-medium tabular-nums sm:text-sm",
                                      vv === "up" &&
                                        "text-alt-green-deep dark:text-alt-green-deep",
                                      vv === "down" &&
                                        "text-alt-red-deep dark:text-alt-red-deep",
                                      vv === null && "text-muted-foreground"
                                    )}
                                    aria-label={voteAria}
                                    title={voteAria}
                                  >
                                    {voteMark}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">
                                  {c.body}
                                </p>
                                {isRemixCommentBody(c.body) ? (
                                  <>
                                    <Link
                                      to={studioHref}
                                      className={cn(
                                        "relative mt-2 block w-fit overflow-hidden rounded-md border border-black/[0.08] bg-muted shadow-sm outline-none transition",
                                        "h-12 w-20 hover:opacity-95 hover:ring-2 hover:ring-ring/35 focus-visible:ring-2 focus-visible:ring-ring dark:border-white/[0.12]"
                                      )}
                                      aria-label={`View ${item.appName} in studio`}
                                      title={`View ${item.appName} in studio`}
                                    >
                                      <iframe
                                        srcDoc={item.previewHtml}
                                        sandbox="allow-scripts"
                                        title=""
                                        className="pointer-events-none absolute left-0 top-0 block border-0"
                                        style={{
                                          width: 400,
                                          height: 225,
                                          transform: "scale(0.2)",
                                          transformOrigin: "0 0",
                                        }}
                                      />
                                    </Link>
                                    <div className="mt-2 flex w-full flex-wrap items-center justify-end gap-2">
                                      <Link
                                        to={studioHref}
                                        className="text-[11px] font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
                                      >
                                        View app
                                      </Link>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2.5 text-[11px] font-medium"
                                        onClick={() => {
                                          setRemixText("")
                                          setRemixListPostId(item.id)
                                        }}
                                      >
                                        Remix
                                      </Button>
                                    </div>
                                  </>
                                ) : null}
                              </div>
                            </li>
                            )
                          })}
                        </ul>
                        <form
                          onSubmit={(e) => submitComment(e, item.id)}
                          className="flex flex-col gap-2 sm:flex-row sm:items-end"
                        >
                          <label className="sr-only" htmlFor={`comment-${item.id}`}>
                            Add a comment
                          </label>
                          <textarea
                            id={`comment-${item.id}`}
                            rows={2}
                            value={draftByPost[item.id] ?? ""}
                            onChange={(e) =>
                              setDraftByPost((p) => ({
                                ...p,
                                [item.id]: e.target.value,
                              }))
                            }
                            placeholder="Add a comment…"
                            className="min-h-[72px] w-full flex-1 resize-y rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:border-white/[0.12] dark:bg-background"
                          />
                          <Button type="submit" size="sm" className="shrink-0 sm:mb-0.5">
                            Comment
                          </Button>
                        </form>
                      </div>
                    </div>
                  ) : null}
                </article>
              </li>
            )
          })}
        </ol>
      </main>

      <Dialog
        open={remixListPostId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRemixListPostId(null)
            setRemixText("")
          }
        }}
      >
        <DialogContent className="flex max-h-[min(85vh,36rem)] flex-col gap-4 overflow-hidden p-5 sm:max-w-lg">
          {remixListDialogItem ? (
            <>
              <DialogHeader>
                <DialogTitle>Remixes</DialogTitle>
                <DialogDescription>
                  Forks and variants spun from{" "}
                  <span className="font-medium text-foreground">
                    {remixListDialogItem.appName}
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>
              <ul
                className="max-h-[min(38vh,18rem)] min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-0.5"
                aria-label="Remix list"
              >
                {mockRemixListForItem(remixListDialogItem).map((r) => (
                  <li key={r.id}>
                    <Link
                      to={studioPathForProtocol(remixListDialogItem.appName)}
                      onClick={() => setRemixListPostId(null)}
                      className="flex gap-3 rounded-xl border border-black/[0.08] bg-muted/25 p-3 transition-colors hover:bg-muted/45 dark:border-white/[0.1] dark:hover:bg-muted/20"
                    >
                      <Avatar className="size-9 shrink-0 rounded-lg">
                        <AvatarFallback className="rounded-lg text-xs font-medium">
                          {r.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-foreground">
                          {r.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/80">
                            {r.author}
                          </span>
                          <span aria-hidden> · </span>
                          <span title={new Date(r.createdAt).toLocaleString()}>
                            {formatShortTimeAgo(r.createdAt)}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                          {formatCount(r.score)} votes
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div
                className="shrink-0 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]"
                role="region"
                aria-label="Add a remix idea"
              >
                <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-md bg-sky-50 px-2 py-1 text-[13px] font-medium leading-snug text-sky-900 dark:bg-sky-950/50 dark:text-sky-100">
                  <MousePointer2Icon
                    className="size-4 shrink-0 opacity-85 text-sky-700 dark:text-sky-300"
                    aria-hidden
                  />
                  <span className="truncate">{remixListDialogItem.appName}</span>
                </div>
                <div className="flex items-end gap-2">
                  <label className="sr-only" htmlFor="feed-remix-dialog-composer">
                    How you want to remix this app
                  </label>
                  <textarea
                    ref={remixInputRef}
                    id="feed-remix-dialog-composer"
                    rows={2}
                    value={remixText}
                    onChange={(e) => setRemixText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        submitRemixIdea(remixListDialogItem.id)
                      }
                    }}
                    placeholder="What should this remix do differently?"
                    className="max-h-28 min-h-[44px] flex-1 resize-none rounded-lg border-0 bg-black/[0.03] px-2.5 py-2 text-[13px] leading-snug text-foreground outline-none ring-0 placeholder:text-muted-foreground/80 focus-visible:bg-black/[0.04] dark:bg-white/[0.06] dark:focus-visible:bg-white/[0.08]"
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="size-9 shrink-0 rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/25 hover:text-background dark:hover:bg-muted-foreground/35"
                    aria-label="Send remix idea"
                    disabled={!remixText.trim()}
                    onClick={() => submitRemixIdea(remixListDialogItem.id)}
                  >
                    <ArrowUpIcon className="size-4" strokeWidth={2.25} />
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
