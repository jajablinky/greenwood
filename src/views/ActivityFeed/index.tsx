import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react"
import {
  AppWindow,
  ArrowUpIcon,
  Link2,
  MessageSquare,
  MessageSquareIcon,
  MousePointer2Icon,
  Plus,
  Send,
  ShuffleIcon,
} from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

import { ConnectWalletButton } from "components/molecules/ConnectWalletButton"
import {
  ProjectStatusPill,
  type ProjectRunStatus,
} from "components/atoms/ProjectStatusPill"
import { VoteBlockArrowDown, VoteBlockArrowUp } from "components/atoms/VoteBlockArrows"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/atoms/Dialog"
import { CreateProjectDialog } from "components/molecules/CreateProjectDialog"
import { activityDetailPath, studioPathForProtocol } from "helpers/app-route-name"
import {
  INITIAL_ACTIVITY_FEED,
  mockRemixListForItem,
  type FeedComment,
  type GlobalFeedItem,
} from "helpers/activity-feed-mock-data"
import {
  buildCommentTree,
  FEED_COMMENT_TOP_N,
  sortCommentRootsByHot,
} from "helpers/comment-tree"
import { feedDetailAbsoluteUrl } from "helpers/feed-detail-url"
import { profilePathForAuthor } from "helpers/profile-path"
import { formatCount } from "helpers/format-count"
import { formatShortTimeAgo } from "helpers/format-short-time-ago"
import { slicePrompt } from "helpers/remix-comment"
import { workspaceSlugFromFeedId } from "helpers/ouro-feed-items"
import { postMessageToGeneralChannel } from "helpers/ouroboros/api"
import { useArweaveProvider } from "providers/ArweaveProvider"
import { useProjects } from "providers/ProjectsProvider"
import { useToaster } from "providers/ToasterProvider"

import {
  CommentThreadNode,
  type FeedReplyTarget,
} from "components/molecules/CommentThread"
import {
  CommentsStatRowList,
  OpenDetailCommentsLink,
  ViewMoreCommentsButton,
  ViewMoreCommentsRow,
} from "components/molecules/CommentThread/styles"
import * as DetailCommentS from "views/AppDetail/styles"
import { FeedPostOverflowMenu } from "./FeedPostOverflowMenu"
import * as S from "./styles"

type ViewerVote = "up" | "down" | null

function newCommentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `me-${crypto.randomUUID().slice(0, 8)}`
  }
  return `me-${Date.now()}`
}

function hotScore(item: GlobalFeedItem, viewerDelta: number): number {
  const hours = Math.max(1, (Date.now() - item.createdAt) / 3_600_000)
  return (item.score + viewerDelta) / Math.pow(hours + 2, 1.5)
}

function scoreTone(score: number): "positive" | "negative" | "neutral" {
  if (score > 0) return "positive"
  if (score < 0) return "negative"
  return "neutral"
}

export function ActivityFeedPage() {
  const { ouroFeedItems, getStatusForSlug, getThoughtLog } = useProjects()
  const { walletAddress, connect } = useArweaveProvider()
  const { push } = useToaster()
  const [searchParams, setSearchParams] = useSearchParams()
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [votes, setVotes] = useState<Record<string, ViewerVote>>({})
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, FeedComment[]>
  >(() =>
    Object.fromEntries(INITIAL_ACTIVITY_FEED.map((i) => [i.id, i.initialComments]))
  )
  const [draftByPost, setDraftByPost] = useState<Record<string, string>>({})
  const [composerBusyByPost, setComposerBusyByPost] = useState<
    Record<string, boolean>
  >({})
  const [remixText, setRemixText] = useState("")
  /** Feed row remix control opens a dialog: fork list + compose. */
  const [remixListPostId, setRemixListPostId] = useState<string | null>(null)
  const remixInputRef = useRef<HTMLTextAreaElement>(null)
  /** Scroll + ring a specific comment (e.g. after remix, or “Open in thread”). */
  const [highlightComment, setHighlightComment] = useState<{
    postId: string
    commentId: string
  } | null>(null)
  const [feedReplyTarget, setFeedReplyTarget] = useState<FeedReplyTarget | null>(
    null,
  )
  const [feedReplyDraft, setFeedReplyDraft] = useState("")
  const [showAllFeedComments, setShowAllFeedComments] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    if (searchParams.get("action") !== "create") {
      return
    }
    const t = window.setTimeout(() => {
      setCreateProjectOpen(true)
      const next = new URLSearchParams(searchParams)
      next.delete("action")
      setSearchParams(next, { replace: true })
    }, 0)
    return () => window.clearTimeout(t)
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!highlightComment) {
      return
    }
    const { postId, commentId } = highlightComment
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
  }, [highlightComment])

  useEffect(() => {
    if (!remixListPostId) {
      return
    }
    const t = window.setTimeout(() => remixInputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [remixListPostId])

  const sortedFeed = useMemo(() => {
    const list = [...ouroFeedItems, ...INITIAL_ACTIVITY_FEED]
    const viewerDelta = (id: string) =>
      votes[id] === "up" ? 1 : votes[id] === "down" ? -1 : 0

    list.sort(
      (a, b) =>
        hotScore(b, viewerDelta(b.id)) - hotScore(a, viewerDelta(a.id))
    )
    return list
  }, [votes, ouroFeedItems])

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
    async (e: FormEvent, postId: string, ouroSlug: string | null) => {
      e.preventDefault()
      const raw = (draftByPost[postId] ?? "").trim()
      if (!raw) {
        return
      }

      if (ouroSlug) {
        if (!walletAddress) {
          await connect()
          push({ title: "Connect wallet to continue", variant: "warning" })
          return
        }
        setComposerBusyByPost((prev) => ({ ...prev, [postId]: true }))
        try {
          await postMessageToGeneralChannel(ouroSlug, raw)
          setDraftByPost((prev) => ({ ...prev, [postId]: "" }))
        } catch (err) {
          push({
            variant: "warning",
            title: "Message failed",
            body: err instanceof Error ? err.message : String(err),
          })
        } finally {
          setComposerBusyByPost((prev) => ({ ...prev, [postId]: false }))
        }
        return
      }

      const row: FeedComment = {
        id: newCommentId(),
        parentId: null,
        author: "you",
        authorInitials: "ME",
        body: raw,
        createdAt: Date.now(),
        score: 0,
        viewerVote: null,
      }
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), row],
      }))
      setDraftByPost((prev) => ({ ...prev, [postId]: "" }))
    },
    [connect, draftByPost, push, walletAddress]
  )

  const submitRemixIdea = useCallback(
    (postId: string) => {
      const raw = remixText.trim()
      if (!raw) {
        return
      }
      const row: FeedComment = {
        id: newCommentId(),
        parentId: null,
        author: "you",
        authorInitials: "ME",
        body: `Remix: ${raw}`,
        createdAt: Date.now(),
        score: 0,
        viewerVote: null,
      }
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), row],
      }))
      setRemixListPostId(null)
      setRemixText("")
      setHighlightComment({ postId, commentId: row.id })
    },
    [remixText]
  )

  const toggleFeedCommentVote = useCallback(
    (postId: string, commentId: string, direction: "up" | "down") => {
      setCommentsByPost((prev) => {
        const list = prev[postId] ?? []
        return {
          ...prev,
          [postId]: list.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  viewerVote: c.viewerVote === direction ? null : direction,
                }
              : c,
          ),
        }
      })
    },
    []
  )

  const submitFeedReply = useCallback(
    (e: FormEvent, postId: string) => {
      e.preventDefault()
      const raw = feedReplyDraft.trim()
      if (!raw || !feedReplyTarget || feedReplyTarget.postId !== postId) {
        return
      }
      const row: FeedComment = {
        id: newCommentId(),
        parentId: feedReplyTarget.parentId,
        author: "you",
        authorInitials: "ME",
        body: raw,
        createdAt: Date.now(),
        score: 0,
        viewerVote: null,
      }
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), row],
      }))
      setFeedReplyDraft("")
      setFeedReplyTarget(null)
    },
    [feedReplyDraft, feedReplyTarget]
  )

  return (
    <S.Page>
      <S.StickyHeader>
        <S.HeaderInner>
          <S.HeaderBrandWrap>
            <S.HeaderBrandLink to="/">PermawebOS</S.HeaderBrandLink>
          </S.HeaderBrandWrap>
          <S.HeaderActions>
            <S.HeaderNewProjectButton
              type="button"
              onClick={() => setCreateProjectOpen(true)}
            >
              Create
              <Plus strokeWidth={2} aria-hidden />
            </S.HeaderNewProjectButton>
            <ConnectWalletButton />
          </S.HeaderActions>
        </S.HeaderInner>
      </S.StickyHeader>

      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
      />

      <S.FeedMain>
        <S.FeedList>
          {sortedFeed.map((item) => {
            const v = votes[item.id] ?? null
            const score = displayScore(item)
            const comments = commentsByPost[item.id] ?? []
            const studioHref = studioPathForProtocol(item.appName)
            const detailHref = activityDetailPath(item.id)
            const remixListCount = mockRemixListForItem(item).length
            const cardTitle = item.cardTitle ?? item.appName
            const ouroSlug = workspaceSlugFromFeedId(item.id)
            const ouroStatus: ProjectRunStatus | undefined = ouroSlug
              ? getStatusForSlug(ouroSlug) ?? "idle"
              : undefined
            const thoughtLines = ouroSlug ? getThoughtLog(ouroSlug) : []
            const feedComposerBusy = composerBusyByPost[item.id] === true
            const feedComposerContextLabel =
              item.cardTitle && item.cardTitle !== item.appName
                ? `${item.appName} — ${item.cardTitle}`
                : cardTitle
            const feedComposerPlaceholder = ouroSlug
              ? "Message #general (team lead sees it)…"
              : "Add a comment…"

            return (
              <li key={item.id}>
                <S.FeedItemArticle>
                  <S.FeedCard
                    style={
                      {
                        "--feed-hover-accent": item.previewHoverAccent,
                      } as React.CSSProperties
                    }
                    aria-label={`${item.appName} listing`}
                  >
                    <S.CardOverlayLink
                      to={detailHref}
                      aria-label={`Open ${item.appName} detail page`}
                      title={`Open ${item.appName} detail page`}
                    />
                    <S.CardTweetSection>
                      <S.BuilderAvatarLink
                        to={profilePathForAuthor(item.builder)}
                        aria-label={`Open ${item.builder} profile`}
                        title={item.builder}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <S.BuilderAvatar
                          aria-label={`Builder wallet ${item.builderWallet}`}
                          title={item.builderWallet}
                        >
                          <S.BuilderAvatarFallback>
                            {item.builderInitials}
                          </S.BuilderAvatarFallback>
                        </S.BuilderAvatar>
                      </S.BuilderAvatarLink>
                      <S.FeedTweetBody>
                        <S.FeedTweetAppRow>
                          <S.FeedTweetAppLeading>
                            <S.FeedTweetAppName>{item.appName}</S.FeedTweetAppName>
                            {ouroStatus ? (
                              <ProjectStatusPill status={ouroStatus} />
                            ) : null}
                          </S.FeedTweetAppLeading>
                          <S.FeedTweetPromptAside>
                            <S.FeedTweetTime
                              title={new Date(item.createdAt).toLocaleString()}
                            >
                              {formatShortTimeAgo(item.createdAt)}
                            </S.FeedTweetTime>
                            <FeedPostOverflowMenu
                              detailPath={detailHref}
                              transactionId={item.transactionId}
                              cardLabel={cardTitle}
                            />
                          </S.FeedTweetPromptAside>
                        </S.FeedTweetAppRow>
                        <S.FeedTweetPrompt title={item.detail}>
                          {slicePrompt(item.detail, 200)}
                        </S.FeedTweetPrompt>
                      </S.FeedTweetBody>

                      <S.FeedListingVoteCluster
                        role="group"
                        aria-label="Vote on this listing"
                      >
                        <S.VoteIconBtn
                          variant="vote"
                          voteDirection="up"
                          aria-label="Upvote"
                          aria-pressed={v === "up"}
                          onClick={() => toggleVote(item.id, "up")}
                        >
                          <S.VoteArrowWrap>
                            <VoteBlockArrowUp filled={v === "up"} />
                          </S.VoteArrowWrap>
                        </S.VoteIconBtn>
                        <S.FeedListingScoreValue
                          $tone={scoreTone(score)}
                          title="Score"
                        >
                          {formatCount(score)}
                        </S.FeedListingScoreValue>
                        <S.VoteIconBtn
                          variant="vote"
                          voteDirection="down"
                          aria-label="Downvote"
                          aria-pressed={v === "down"}
                          onClick={() => toggleVote(item.id, "down")}
                        >
                          <S.VoteArrowWrap>
                            <VoteBlockArrowDown filled={v === "down"} />
                          </S.VoteArrowWrap>
                        </S.VoteIconBtn>
                      </S.FeedListingVoteCluster>
                      <S.CardPreviewFrame>
                        <S.CardPreviewIframe
                          title={`${item.appName} preview`}
                          srcDoc={item.previewHtml}
                          sandbox="allow-scripts"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </S.CardPreviewFrame>

                      <S.CardActionBar>
                        <S.FeedCommentLinkButton
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={<Link to={detailHref} />}
                          title={`${comments.length} ${comments.length === 1 ? "comment" : "comments"} — open detail`}
                          aria-label={`Open ${cardTitle} detail — ${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
                        >
                          <S.Icon16>
                            <MessageSquareIcon strokeWidth={2} aria-hidden />
                          </S.Icon16>
                          <S.TabularText>
                            {comments.length > 99 ? "99+" : comments.length}
                          </S.TabularText>
                        </S.FeedCommentLinkButton>
                        <S.FeedRemixToggleButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          title={`${remixListCount} remixes — add idea or browse forks`}
                          aria-label={`Remix ${item.appName}: ${remixListCount} forks, open list and composer`}
                          aria-expanded={remixListPostId === item.id}
                          aria-haspopup="dialog"
                          $remixOpen={remixListPostId === item.id}
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
                          <S.Icon16>
                            <ShuffleIcon strokeWidth={2} aria-hidden />
                          </S.Icon16>
                          <S.FeedRemixButtonText>Remix</S.FeedRemixButtonText>
                          <S.TabularText>
                            {remixListCount > 99 ? "99+" : remixListCount}
                          </S.TabularText>
                        </S.FeedRemixToggleButton>
                        <S.FeedActionIconButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          title="Copy link to this listing"
                          aria-label={`Copy link to ${cardTitle}`}
                          onPointerDown={(e) => {
                            e.stopPropagation()
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            void navigator.clipboard
                              .writeText(feedDetailAbsoluteUrl(detailHref))
                              .then(
                                () => {
                                  push({
                                    title: "Link copied",
                                    variant: "success",
                                  })
                                },
                                () => {
                                  push({
                                    title: "Could not copy link",
                                    variant: "warning",
                                  })
                                },
                              )
                          }}
                        >
                          <S.Icon16>
                            <Link2 strokeWidth={2} aria-hidden />
                          </S.Icon16>
                        </S.FeedActionIconButton>
                        <S.FeedViewAppLinkButton
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={<Link to={detailHref} />}
                          title={`Open ${item.appName} app`}
                          aria-label={`View app — ${item.appName}`}
                        >
                          <S.Icon16>
                            <AppWindow strokeWidth={2} aria-hidden />
                          </S.Icon16>
                        </S.FeedViewAppLinkButton>
                      </S.CardActionBar>
                    </S.CardTweetSection>
                  </S.FeedCard>

                  <S.ThreadPanel id={`comments-${item.id}`}>
                    <S.ThreadInner>
                      {ouroSlug ? (
                        <DetailCommentS.ThoughtPanel aria-live="polite">
                          <DetailCommentS.ThoughtPanelLabel>
                            Team lead (streaming)
                          </DetailCommentS.ThoughtPanelLabel>
                          <DetailCommentS.ThoughtPre>
                            {thoughtLines.length > 0
                              ? thoughtLines.join("")
                              : "Waiting for agent output…"}
                          </DetailCommentS.ThoughtPre>
                        </DetailCommentS.ThoughtPanel>
                      ) : null}

                      <form
                        onSubmit={(e) => void submitComment(e, item.id, ouroSlug)}
                      >
                        <label
                          htmlFor={`feed-comment-${item.id}`}
                          className="sr-only"
                        >
                          {ouroSlug ? "Message workspace" : "Add comment"}
                        </label>
                        <DetailCommentS.DetailComposerWrapper
                          data-create-mode="false"
                        >
                          <DetailCommentS.CommentComposerShell>
                            <DetailCommentS.DetailCreateContextTag>
                              <DetailCommentS.DetailCreateContextIcon>
                                <Send strokeWidth={2} aria-hidden />
                              </DetailCommentS.DetailCreateContextIcon>
                              <DetailCommentS.DetailCreateContextText>
                                {feedComposerContextLabel}
                              </DetailCommentS.DetailCreateContextText>
                            </DetailCommentS.DetailCreateContextTag>
                            <DetailCommentS.DetailComposerFieldRow>
                              <DetailCommentS.CommentComposerTextarea
                                id={`feed-comment-${item.id}`}
                                value={draftByPost[item.id] ?? ""}
                                onChange={(e) =>
                                  setDraftByPost((p) => ({
                                    ...p,
                                    [item.id]: e.target.value,
                                  }))
                                }
                                rows={1}
                                placeholder={feedComposerPlaceholder}
                              />
                              <DetailCommentS.PostCommentFab
                                type="submit"
                                disabled={
                                  !(draftByPost[item.id] ?? "").trim() ||
                                  feedComposerBusy
                                }
                                aria-label={
                                  ouroSlug
                                    ? "Send message to workspace"
                                    : "Post comment"
                                }
                                title={
                                  ouroSlug ? "Send to #general" : "Post comment"
                                }
                              >
                                <DetailCommentS.PostCommentFabIcon>
                                  <ArrowUpIcon strokeWidth={2.25} aria-hidden />
                                </DetailCommentS.PostCommentFabIcon>
                              </DetailCommentS.PostCommentFab>
                            </DetailCommentS.DetailComposerFieldRow>
                          </DetailCommentS.CommentComposerShell>
                        </DetailCommentS.DetailComposerWrapper>
                      </form>

                      {comments.length === 0 ? (
                        <DetailCommentS.EmptyComments>
                          <DetailCommentS.EmptyCommentsIcon>
                            <MessageSquare strokeWidth={1} aria-hidden />
                          </DetailCommentS.EmptyCommentsIcon>
                          <DetailCommentS.EmptyCommentsTitle>
                            No comments yet
                          </DetailCommentS.EmptyCommentsTitle>
                          <DetailCommentS.EmptyCommentsHint>
                            Be the first to add a comment
                          </DetailCommentS.EmptyCommentsHint>
                        </DetailCommentS.EmptyComments>
                      ) : (
                        (() => {
                          const threadRoots = sortCommentRootsByHot(
                            buildCommentTree(comments),
                          )
                          const expanded = showAllFeedComments[item.id] === true
                          const hiddenRootCount = Math.max(
                            0,
                            threadRoots.length - FEED_COMMENT_TOP_N,
                          )
                          const visibleRoots =
                            expanded ||
                            threadRoots.length <= FEED_COMMENT_TOP_N
                              ? threadRoots
                              : threadRoots.slice(0, FEED_COMMENT_TOP_N)
                          return (
                            <>
                              <CommentsStatRowList>
                                {visibleRoots.map((node) => (
                                  <CommentThreadNode
                                    key={node.id}
                                    mode="feed"
                                    node={node}
                                    feed={{
                                      postId: item.id,
                                      item,
                                      studioHref,
                                      highlightComment,
                                      feedReplyTarget,
                                      setFeedReplyTarget,
                                      feedReplyDraft,
                                      setFeedReplyDraft,
                                      toggleFeedCommentVote,
                                      submitFeedReply,
                                      setRemixText,
                                      setRemixListPostId,
                                    }}
                                  />
                                ))}
                              </CommentsStatRowList>
                              {hiddenRootCount > 0 && !expanded ? (
                                <ViewMoreCommentsRow>
                                  <ViewMoreCommentsButton
                                    type="button"
                                    onClick={() =>
                                      setShowAllFeedComments((p) => ({
                                        ...p,
                                        [item.id]: true,
                                      }))
                                    }
                                  >
                                    View {hiddenRootCount} more{" "}
                                    {hiddenRootCount === 1
                                      ? "thread"
                                      : "threads"}
                                  </ViewMoreCommentsButton>
                                  <OpenDetailCommentsLink
                                    to={`${detailHref}#comments`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Open full thread
                                  </OpenDetailCommentsLink>
                                </ViewMoreCommentsRow>
                              ) : null}
                            </>
                          )
                        })()
                      )}
                    </S.ThreadInner>
                  </S.ThreadPanel>
                </S.FeedItemArticle>
              </li>
            )
          })}
        </S.FeedList>
      </S.FeedMain>

      <Dialog
        open={remixListPostId !== null}
        onOpenChange={(dialogOpen) => {
          if (!dialogOpen) {
            setRemixListPostId(null)
            setRemixText("")
          }
        }}
      >
        <S.RemixDialogContent>
          {remixListDialogItem ? (
            <>
              <DialogHeader>
                <DialogTitle>Remixes</DialogTitle>
                <DialogDescription>
                  Forks and variants spun from{" "}
                  <S.DialogTitleAccent>
                    {remixListDialogItem.appName}
                  </S.DialogTitleAccent>
                  .
                </DialogDescription>
              </DialogHeader>
              <S.RemixDialogList aria-label="Remix list">
                {mockRemixListForItem(remixListDialogItem).map((r) => (
                  <li key={r.id}>
                    <S.RemixDialogRowLink
                      to={studioPathForProtocol(remixListDialogItem.appName)}
                      onClick={() => setRemixListPostId(null)}
                    >
                      <S.RemixDialogAvatar>
                        <S.RemixDialogAvatarFallback>
                          {r.authorInitials}
                        </S.RemixDialogAvatarFallback>
                      </S.RemixDialogAvatar>
                      <S.RemixDialogRowBody>
                        <S.RemixDialogRowTitle>{r.title}</S.RemixDialogRowTitle>
                        <S.RemixDialogRowMeta>
                          <S.RemixDialogAuthor>{r.author}</S.RemixDialogAuthor>
                          <span aria-hidden> · </span>
                          <span title={new Date(r.createdAt).toLocaleString()}>
                            {formatShortTimeAgo(r.createdAt)}
                          </span>
                        </S.RemixDialogRowMeta>
                        <S.RemixDialogVotes>
                          {formatCount(r.score)} votes
                        </S.RemixDialogVotes>
                      </S.RemixDialogRowBody>
                    </S.RemixDialogRowLink>
                  </li>
                ))}
              </S.RemixDialogList>
              <S.RemixComposerSection
                role="region"
                aria-label="Add a remix idea"
              >
                <S.RemixContextChip>
                  <S.RemixContextIcon>
                    <MousePointer2Icon aria-hidden />
                  </S.RemixContextIcon>
                  <S.RemixContextName>{remixListDialogItem.appName}</S.RemixContextName>
                </S.RemixContextChip>
                <S.RemixComposerRow>
                  <label className="sr-only" htmlFor="feed-remix-dialog-composer">
                    How you want to remix this app
                  </label>
                  <S.RemixComposerTextarea
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
                  />
                  <S.RemixSendIconButton
                    type="button"
                    size="icon"
                    aria-label="Send remix idea"
                    disabled={!remixText.trim()}
                    onClick={() => submitRemixIdea(remixListDialogItem.id)}
                  >
                    <ArrowUpIcon strokeWidth={2.25} />
                  </S.RemixSendIconButton>
                </S.RemixComposerRow>
              </S.RemixComposerSection>
            </>
          ) : null}
        </S.RemixDialogContent>
      </Dialog>
    </S.Page>
  )
}

export default ActivityFeedPage
