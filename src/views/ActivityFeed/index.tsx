import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react"
import {
  ArrowUpIcon,
  Globe,
  MessageSquareIcon,
  Plus,
  Send,
  ShuffleIcon,
} from "assets/icons"
import { Link, useSearchParams } from "react-router-dom"

import {
  ProjectStatusPill,
  type ProjectRunStatus,
} from "components/atoms/ProjectStatusPill"
import { VoteBlockArrowDown, VoteBlockArrowUp } from "components/atoms/VoteBlockArrows"
import { CreateProjectDialog } from "components/molecules/CreateProjectDialog"
import { ProfileHoverCard } from "components/molecules/ProfileHoverCard/ProfileHoverCard"
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
import { profilePathForAuthor } from "helpers/profile-path"
import { formatCount } from "helpers/format-count"
import { formatShortTimeAgo } from "helpers/format-short-time-ago"
import { APP_MOCK_ONLY } from "helpers/app-mode"
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

type FeedSort = "popular" | "new"

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
  const { ouroFeedItems, getStatusForSlug } = useProjects()
  const { walletAddress, connect } = useArweaveProvider()
  const { push } = useToaster()
  const [searchParams, setSearchParams] = useSearchParams()
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  /** When set, create-app dialog opens with this listing as the remix source. */
  const [remixCreateFeedId, setRemixCreateFeedId] = useState<string | null>(null)
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
  /** Inline thread list hidden until the comments control is used (or a comment is posted). */
  const [feedCommentsRevealed, setFeedCommentsRevealed] = useState<
    Record<string, boolean>
  >({})
  const [feedSort, setFeedSort] = useState<FeedSort>("popular")

  useEffect(() => {
    if (searchParams.get("action") !== "create") {
      return
    }
    const remixParam = searchParams.get("remix")
    const t = window.setTimeout(() => {
      setRemixCreateFeedId(remixParam)
      setCreateProjectOpen(true)
      const next = new URLSearchParams(searchParams)
      next.delete("action")
      next.delete("remix")
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

  const sortedFeed = useMemo(() => {
    const list = [...ouroFeedItems, ...INITIAL_ACTIVITY_FEED]
    const viewerDelta = (id: string) =>
      votes[id] === "up" ? 1 : votes[id] === "down" ? -1 : 0

    if (feedSort === "new") {
      list.sort(
        (a, b) =>
          b.createdAt - a.createdAt || a.id.localeCompare(b.id),
      )
      return list
    }

    list.sort(
      (a, b) =>
        hotScore(b, viewerDelta(b.id)) - hotScore(a, viewerDelta(a.id)),
    )
    return list
  }, [votes, ouroFeedItems, feedSort])

  const remixSourceForDialog = useMemo(() => {
    if (!remixCreateFeedId) {
      return null
    }
    const row = sortedFeed.find((i) => i.id === remixCreateFeedId) ?? null
    if (!row) {
      return null
    }
    return {
      id: row.id,
      appName: row.appName,
      appSlug: row.appSlug,
      previewHtml: row.previewHtml,
      cardTitle: row.cardTitle,
    }
  }, [remixCreateFeedId, sortedFeed])

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

      if (ouroSlug && !APP_MOCK_ONLY) {
        if (!walletAddress) {
          await connect()
          push({ title: "Connect wallet to continue", variant: "warning" })
          return
        }
        setComposerBusyByPost((prev) => ({ ...prev, [postId]: true }))
        try {
          await postMessageToGeneralChannel(ouroSlug, raw)
          setDraftByPost((prev) => ({ ...prev, [postId]: "" }))
          setFeedCommentsRevealed((prev) => ({ ...prev, [postId]: true }))
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
      setFeedCommentsRevealed((prev) => ({ ...prev, [postId]: true }))
    },
    [connect, draftByPost, push, walletAddress]
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
            <S.HeaderConnectWalletButton />
          </S.HeaderActions>
        </S.HeaderInner>
        <S.FeedSortBar role="tablist" aria-label="Sort feed">
          <S.FeedSortPill
            type="button"
            role="tab"
            aria-selected={feedSort === "popular"}
            $active={feedSort === "popular"}
            onClick={() => setFeedSort("popular")}
          >
            Popular
          </S.FeedSortPill>
          <S.FeedSortPill
            type="button"
            role="tab"
            aria-selected={feedSort === "new"}
            $active={feedSort === "new"}
            onClick={() => setFeedSort("new")}
          >
            New
          </S.FeedSortPill>
        </S.FeedSortBar>
      </S.StickyHeader>

      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={(open) => {
          setCreateProjectOpen(open)
          if (!open) {
            setRemixCreateFeedId(null)
          }
        }}
        remixSource={remixSourceForDialog}
      />

      <S.FeedCreateFab
        type="button"
        variant="accent"
        size="lg"
        aria-label="Create app"
        title="Create app"
        onClick={() => {
          setRemixCreateFeedId(null)
          setCreateProjectOpen(true)
        }}
      >
        <Plus strokeWidth={2.25} aria-hidden />
        <span>Create</span>
      </S.FeedCreateFab>

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
            const feedComposerBusy = composerBusyByPost[item.id] === true
            const commentsThreadVisible = feedCommentsRevealed[item.id] === true
            const feedComposerContextLabel =
              item.cardTitle && item.cardTitle !== item.appName
                ? `${item.appName} — ${item.cardTitle}`
                : cardTitle
            const feedComposerPlaceholder = ouroSlug
              ? `What would you like ${cardTitle} to look like?`
              : "Add a comment…"

            return (
              <li key={item.id}>
                <S.FeedItemArticle>
                  <S.FeedListingSurface
                    style={
                      {
                        "--feed-hover-accent": item.previewHoverAccent,
                      } as React.CSSProperties
                    }
                  >
                  <S.FeedCard aria-label={`${item.appName} listing`}>
                    <S.CardOverlayLink
                      to={detailHref}
                      aria-label={`Open ${item.appName} detail page`}
                      title={`Open ${item.appName} detail page`}
                    />
                    <S.CardTweetSection>
                      <S.FeedTweetBody>
                        <S.FeedTweetAppRow>
                          <S.FeedTweetAppLeading>
                      <ProfileHoverCard handle={item.builder}>
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
                      </ProfileHoverCard>
                            <S.FeedTweetAppName>{item.appName}</S.FeedTweetAppName>
                            {ouroStatus ? (
                              <ProjectStatusPill status={ouroStatus} />
                            ) : null}
                            <S.FeedTweetTimeInline>
                              <S.FeedTweetTimeSep aria-hidden>·</S.FeedTweetTimeSep>
                              <S.FeedTweetTime
                                title={new Date(item.createdAt).toLocaleString()}
                              >
                                {formatShortTimeAgo(item.createdAt)}
                              </S.FeedTweetTime>
                            </S.FeedTweetTimeInline>
                          </S.FeedTweetAppLeading>
                          <S.CardActionBarOverflow>
                            <FeedPostOverflowMenu
                              detailPath={detailHref}
                              transactionId={item.transactionId}
                              cardLabel={cardTitle}
                            />
                          </S.CardActionBarOverflow>
                        </S.FeedTweetAppRow>
                      </S.FeedTweetBody>

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
                        <S.FeedSocialActionCluster
                          role="group"
                          aria-label="Listing actions"
                        >
                          <S.FeedCommentLinkButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-expanded={commentsThreadVisible}
                            title={
                              commentsThreadVisible
                                ? `${comments.length} ${comments.length === 1 ? "comment" : "comments"} — hide comments`
                                : `${comments.length} ${comments.length === 1 ? "comment" : "comments"} — show comments`
                            }
                            aria-label={
                              commentsThreadVisible
                                ? `Hide comments on ${cardTitle} — ${comments.length} ${comments.length === 1 ? "comment" : "comments"}`
                                : `Show comments on ${cardTitle} — ${comments.length} ${comments.length === 1 ? "comment" : "comments"}`
                            }
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setFeedCommentsRevealed((p) => {
                                const show = p[item.id] !== true
                                if (show) {
                                  window.setTimeout(() => {
                                    document
                                      .getElementById(`comments-${item.id}`)
                                      ?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                      })
                                  }, 0)
                                }
                                return { ...p, [item.id]: show }
                              })
                            }}
                          >
                            <S.Icon16>
                              <MessageSquareIcon strokeWidth={2} aria-hidden />
                            </S.Icon16>
                            <S.TabularText>
                              {comments.length > 99 ? "99+" : comments.length}
                            </S.TabularText>
                          </S.FeedCommentLinkButton>
                          <S.FeedCommentLinkButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            title={`${remixListCount} community remixes — start yours from this app`}
                            aria-label={`Remix ${item.appName} — opens create remix with this listing (${remixListCount} other remixes on the app page)`}
                            onPointerDown={(e) => {
                              e.stopPropagation()
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setRemixCreateFeedId(item.id)
                              setCreateProjectOpen(true)
                            }}
                          >
                            <S.Icon16>
                              <ShuffleIcon strokeWidth={2} aria-hidden />
                            </S.Icon16>
                            <S.TabularText>
                              {remixListCount > 99 ? "99+" : remixListCount}
                            </S.TabularText>
                          </S.FeedCommentLinkButton>
                          <S.FeedViewAppLinkButton
                            variant="ghost"
                            size="sm"
                            nativeButton={false}
                            render={<Link to={detailHref} />}
                            title={`Open ${item.appName} app`}
                            aria-label={`View app — ${item.appName}`}
                          >
                            <S.Icon16>
                              <Globe strokeWidth={2} aria-hidden />
                            </S.Icon16>
                          </S.FeedViewAppLinkButton>
                        </S.FeedSocialActionCluster>
                        <S.FeedVoteCluster
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
                        </S.FeedVoteCluster>
                      </S.CardActionBar>
                    </S.CardTweetSection>
                  </S.FeedCard>

                  <S.ThreadPanel id={`comments-${item.id}`}>
                    <S.ThreadInner>
                      {commentsThreadVisible ? (
                        <form
                          onSubmit={(e) =>
                            void submitComment(e, item.id, ouroSlug)
                          }
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
                            <DetailCommentS.CommentComposerShell $quietUntilFocus>
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
                                    ouroSlug
                                      ? "Send to team lead"
                                      : "Post comment"
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
                      ) : null}

                      {!commentsThreadVisible ? null : comments.length === 0 ? null : (
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
                                      onOpenRemixCreate: () => {
                                        setRemixCreateFeedId(item.id)
                                        setCreateProjectOpen(true)
                                      },
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
                                    to={detailHref}
                                    state={{ scrollToComments: true }}
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
                  </S.FeedListingSurface>
                </S.FeedItemArticle>
              </li>
            )
          })}
        </S.FeedList>
      </S.FeedMain>

    </S.Page>
  )
}

export default ActivityFeedPage
