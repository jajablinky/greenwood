import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  ClockIcon,
  MessageSquare,
  Send,
  ShuffleIcon,
  XIcon,
} from "assets/icons"
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom"

import {
  ProjectStatusPill,
  type ProjectRunStatus,
} from "components/atoms/ProjectStatusPill"
import { CommentThreadNode } from "components/molecules/CommentThread"
import { CommentsStatRowList } from "components/molecules/CommentThread/styles"
import { VoteBlockArrowDown, VoteBlockArrowUp } from "components/atoms/VoteBlockArrows"

import { APP_MOCK_ONLY } from "helpers/app-mode"
import { activityDetailPath, studioPathForProtocol } from "helpers/app-route-name"
import {
  INITIAL_ACTIVITY_FEED,
  mockRemixListForItem,
  type FeedComment,
} from "helpers/activity-feed-mock-data"
import { buildCommentTree } from "helpers/comment-tree"
import { formatCount } from "helpers/format-count"
import { abbreviateWalletAddress } from "helpers/abbrev-wallet"
import { formatShortTimeAgo } from "helpers/format-short-time-ago"
import { mockWorkspaceSnapshotFromName } from "helpers/mock-workspace-snapshot"
import {
  ouroFeedIdForSlug,
  remixDescription,
  remixParentSlugFromWorkspaceDescription,
  remixTeamLeadPrompt,
  workspaceSlugFromFeedId,
} from "helpers/ouro-feed-items"
import {
  createWorkspace,
  listFolders,
  postMessageToGeneralChannel,
} from "helpers/ouroboros/api"
import { useArweaveProvider } from "providers/ArweaveProvider"
import { useProjects } from "providers/ProjectsProvider"
import { useToaster } from "providers/ToasterProvider"

import { AppPreviewPhoneExpand } from "components/molecules/AppPreviewPhoneExpand/AppPreviewPhoneExpand"
import { MockAgentPromptTimeline, MockAgentTraceList } from "./MockAgentTraceList"
import * as S from "./styles"

type ViewerVote = "up" | "down" | null

type DetailComposerMode = "create" | "comment"

function newCommentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `detail-${crypto.randomUUID().slice(0, 8)}`
  }
  return `detail-${Date.now()}`
}

function scoreTone(score: number): "positive" | "negative" | "neutral" {
  if (score > 0) return "positive"
  if (score < 0) return "negative"
  return "neutral"
}

type AppDetailLocationState = {
  scrollToComments?: boolean
  scrollToRemixes?: boolean
} | null

const MOBILE_HEADER_MQ = "(max-width: 639.98px)"

/** Scroll target for desktop “History” header control (drawer is mobile-only). */
const WORKSPACE_HISTORY_SECTION_ID = "workspace-history"

function subscribeMobileHeader(cb: () => void) {
  const mq = window.matchMedia(MOBILE_HEADER_MQ)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}

function getMobileHeaderSnapshot() {
  return window.matchMedia(MOBILE_HEADER_MQ).matches
}

function getMobileHeaderServerSnapshot() {
  return false
}

export function AppDetailPage() {
  const isMobileHeader = useSyncExternalStore(
    subscribeMobileHeader,
    getMobileHeaderSnapshot,
    getMobileHeaderServerSnapshot,
  )

  const { feedId = "" } = useParams<{ feedId: string }>()
  const decodedId = decodeURIComponent(feedId)
  const location = useLocation()
  const navigate = useNavigate()
  const { push } = useToaster()
  const { walletAddress, connect } = useArweaveProvider()
  const {
    ouroFeedItems,
    snapshotsBySlug,
    addWorkspace,
    getStatusForSlug,
    getMockAgentTrace,
    getMockAgentPhase,
    runMockAgentTurn,
  } = useProjects()

  const item = useMemo(
    () =>
      INITIAL_ACTIVITY_FEED.find((x) => x.id === decodedId) ??
      ouroFeedItems.find((x) => x.id === decodedId) ??
      null,
    [decodedId, ouroFeedItems],
  )

  const ouroSlug = workspaceSlugFromFeedId(decodedId)
  const ouroRunStatus: ProjectRunStatus | undefined = ouroSlug
    ? getStatusForSlug(ouroSlug) ?? "idle"
    : undefined

  const [vote, setVote] = useState<ViewerVote>(null)
  const [comments, setComments] = useState<FeedComment[]>([])
  const [draft, setDraft] = useState("")
  const [postBusy, setPostBusy] = useState(false)
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState("")
  /** Ouro placeholder iframe hidden until there is thread activity or a live channel send. */
  const [ouroLiveMessageSent, setOuroLiveMessageSent] = useState(false)

  useEffect(() => {
    const init =
      INITIAL_ACTIVITY_FEED.find((x) => x.id === decodedId)?.initialComments ??
      ouroFeedItems.find((x) => x.id === decodedId)?.initialComments ??
      []
    setComments(init)
  }, [decodedId, ouroFeedItems])

  useEffect(() => {
    setOuroLiveMessageSent(false)
  }, [decodedId])

  useEffect(() => {
    if (ouroSlug) {
      setDetailComposerMode("comment")
    }
  }, [ouroSlug])

  const [remixAsideOpen, setRemixAsideOpen] = useState(false)
  /** Mobile: full-screen chat history drawer (agent trace for this app). */
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false)
  /** Mock trace: hide entries after this index (revert checkpoint). */
  const [traceRevertEndIndex, setTraceRevertEndIndex] = useState<number | null>(
    null,
  )

  useEffect(() => {
    setRemixAsideOpen(false)
  }, [decodedId])

  useEffect(() => {
    setChatHistoryOpen(false)
  }, [decodedId])

  useEffect(() => {
    setTraceRevertEndIndex(null)
  }, [decodedId])

  useEffect(() => {
    if (!chatHistoryOpen) {
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setChatHistoryOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [chatHistoryOpen])

  useEffect(() => {
    if (typeof document === "undefined" || !chatHistoryOpen) {
      return
    }
    const mq = window.matchMedia("(max-width: 639.98px)")
    if (!mq.matches) {
      return
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [chatHistoryOpen])

  const onHistoryHeaderClick = useCallback(() => {
    if (isMobileHeader) {
      setChatHistoryOpen(true)
    } else {
      document
        .getElementById(WORKSPACE_HISTORY_SECTION_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [isMobileHeader])

  useEffect(() => {
    const st = location.state as AppDetailLocationState
    const targetId = st?.scrollToRemixes
      ? "remixes"
      : st?.scrollToComments
        ? "comments"
        : null
    if (st?.scrollToRemixes) {
      setRemixAsideOpen(true)
    }
    if (!targetId) {
      return
    }
    const t = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 0)
    return () => window.clearTimeout(t)
  }, [location.key, location.state])

  const [detailComposerMode, setDetailComposerMode] =
    useState<DetailComposerMode>("create")
  const [detailComposerModeAnnounce, setDetailComposerModeAnnounce] =
    useState("")

  const commentTree = useMemo(() => buildCommentTree(comments), [comments])

  const remixParentSlug = useMemo(() => {
    if (!item || !ouroSlug) return null
    const desc =
      snapshotsBySlug[ouroSlug]?.workspace.description ?? item.detail
    return remixParentSlugFromWorkspaceDescription(desc)
  }, [item, ouroSlug, snapshotsBySlug])

  const remixParentItem = useMemo(() => {
    if (!remixParentSlug) return null
    const parentId = ouroFeedIdForSlug(remixParentSlug)
    return (
      ouroFeedItems.find((x) => x.id === parentId) ??
      INITIAL_ACTIVITY_FEED.find((x) => x.id === parentId) ??
      ouroFeedItems.find((x) => x.appSlug === remixParentSlug) ??
      INITIAL_ACTIVITY_FEED.find((x) => x.appSlug === remixParentSlug) ??
      null
    )
  }, [remixParentSlug, ouroFeedItems])

  const toggleCommentVote = useCallback((commentId: string, direction: "up" | "down") => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              viewerVote: c.viewerVote === direction ? null : direction,
            }
          : c,
      ),
    )
  }, [])

  function submitReply(e: FormEvent, parentId: string) {
    e.preventDefault()
    const raw = replyDraft.trim()
    if (!raw) return
    setComments((prev) => [
      ...prev,
      {
        id: newCommentId(),
        parentId,
        author: "you",
        authorInitials: "ME",
        body: raw,
        createdAt: Date.now(),
        score: 0,
        viewerVote: null,
      },
    ])
    setReplyDraft("")
    setReplyingToId(null)
  }

  if (!item) {
    return <Navigate to="/" replace />
  }

  const displayScore =
    item.score + (vote === "up" ? 1 : vote === "down" ? -1 : 0)
  const title = item.cardTitle ?? item.appName
  const detailStudioHref = studioPathForProtocol(item.appName)

  function toggleVote(direction: "up" | "down") {
    setVote((cur) => (cur === direction ? null : direction))
  }

  async function runOuroRemixCore(raw: string) {
    if (!item || !ouroSlug) {
      throw new Error("Not an Ouro workspace")
    }
    const titleText = item.cardTitle ?? item.appName
    if (APP_MOCK_ONLY) {
      const snapshot = mockWorkspaceSnapshotFromName(`${titleText} remix`, {
        description: remixDescription(ouroSlug),
      })
      addWorkspace(snapshot)
      navigate(activityDetailPath(`ouro:${snapshot.workspace.slug}`))
      return
    }
    const folders = await listFolders()
    const folderPath = folders[0]?.path
    if (!folderPath) {
      throw new Error("No folder in Ouroboros — open Ouroboros UI once.")
    }
    const snapshot = await createWorkspace({
      name: `${titleText} remix`,
      description: remixDescription(ouroSlug),
      folder_path: folderPath,
      team_lead_prompt: remixTeamLeadPrompt(titleText, raw),
    })
    addWorkspace(snapshot)
    navigate(activityDetailPath(`ouro:${snapshot.workspace.slug}`))
  }

  async function submitComposer(e: FormEvent) {
    e.preventDefault()
    const raw = draft.trim()
    if (!raw || !item) return

    if (ouroSlug && APP_MOCK_ONLY) {
      if (detailComposerMode === "create") {
        setPostBusy(true)
        try {
          await runOuroRemixCore(raw)
          setDraft("")
        } catch (err) {
          push({
            variant: "warning",
            title: "Remix workspace failed",
            body: err instanceof Error ? err.message : String(err),
          })
        } finally {
          setPostBusy(false)
        }
        return
      }
      setComments((prev) => [
        ...prev,
        {
          id: newCommentId(),
          parentId: null,
          author: "you",
          authorInitials: "ME",
          body: raw,
          createdAt: Date.now(),
          score: 0,
          viewerVote: null,
        },
      ])
      setDraft("")
      setOuroLiveMessageSent(true)
      setPostBusy(true)
      try {
        await runMockAgentTurn(ouroSlug, raw, item.appName, (body) => {
          setComments((prev) => [
            ...prev,
            {
              id: newCommentId(),
              parentId: null,
              author: "team_lead",
              authorInitials: "TL",
              body,
              createdAt: Date.now(),
              score: 0,
              viewerVote: null,
            },
          ])
        })
      } finally {
        setPostBusy(false)
      }
      return
    }

    if (ouroSlug) {
      if (!walletAddress) {
        await connect()
        push({ title: "Connect wallet to continue", variant: "warning" })
        return
      }
      if (detailComposerMode === "create") {
        setPostBusy(true)
        try {
          await runOuroRemixCore(raw)
          setDraft("")
        } catch (err) {
          push({
            variant: "warning",
            title: "Remix workspace failed",
            body: err instanceof Error ? err.message : String(err),
          })
        } finally {
          setPostBusy(false)
        }
        return
      }
      setPostBusy(true)
      try {
        await postMessageToGeneralChannel(ouroSlug, raw)
        setOuroLiveMessageSent(true)
        setDraft("")
      } catch (err) {
        push({
          variant: "warning",
          title: "Message failed",
          body: err instanceof Error ? err.message : String(err),
        })
      } finally {
        setPostBusy(false)
      }
      return
    }

    if (detailComposerMode === "create") {
      document.getElementById("comments")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      push({
        title: "Remix ideas",
        body: "Post in the thread below or use Remix on a comment.",
      })
      return
    }

    setComments((prev) => [
      ...prev,
      {
        id: newCommentId(),
        parentId: null,
        author: "you",
        authorInitials: "ME",
        body: raw,
        createdAt: Date.now(),
        score: 0,
        viewerVote: null,
      },
    ])
    setDraft("")
  }

  function onDetailComposerKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && ouroSlug && APP_MOCK_ONLY) {
      if (detailComposerMode === "comment") {
        e.preventDefault()
        if (draft.trim() && !postBusy) {
          void submitComposer(e as unknown as FormEvent)
        }
        return
      }
    }
    if (e.key !== "Tab" || e.shiftKey) return
    e.preventDefault()
    setDetailComposerMode((m) => {
      const next: DetailComposerMode = m === "create" ? "comment" : "create"
      setDetailComposerModeAnnounce(
        next === "create" ? "Create mode" : "Comment mode",
      )
      return next
    })
  }

  const remixComposerPlaceholder = "What should this remix do differently?"

  const detailComposerPlaceholder = ouroSlug
    ? detailComposerMode === "create"
      ? remixComposerPlaceholder
      : `What would you like ${title} to look like?`
    : detailComposerMode === "create"
      ? remixComposerPlaceholder
      : "Add a comment…"

  const detailComposerLabel =
    detailComposerMode === "create"
      ? ouroSlug
        ? "Create workspace from prompt"
        : "Describe a create or remix idea"
      : ouroSlug
        ? "Message workspace"
        : "Add comment"

  const detailComposerSubmitAria =
    detailComposerMode === "create"
      ? ouroSlug
        ? "Create remix workspace from prompt"
        : "Open comments for remix ideas"
      : ouroSlug
        ? "Send message to workspace"
        : "Post comment"

  const detailComposerSubmitTitle =
    detailComposerMode === "create"
      ? ouroSlug
        ? "Create a new workspace from this prompt"
        : "Scroll to comments"
      : ouroSlug
        ? "Send to team lead"
        : "Post comment"

  const detailCreateContextLabel =
    item.cardTitle && item.cardTitle !== item.appName
      ? `${item.appName} — ${item.cardTitle}`
      : title

  /** Until there is thread activity, show the source app’s preview (parent workspace) for remix rows. */
  const showRemixSourcePreview =
    ouroSlug != null &&
    remixParentItem != null &&
    comments.length === 0 &&
    !ouroLiveMessageSent

  const previewDisplayItem = showRemixSourcePreview ? remixParentItem : item

  const showWorkspacePreview =
    ouroSlug == null ||
    comments.length > 0 ||
    ouroLiveMessageSent ||
    showRemixSourcePreview

  const mockPhase = ouroSlug ? getMockAgentPhase(ouroSlug) : undefined
  const mockTrace = ouroSlug ? getMockAgentTrace(ouroSlug) : []
  const showMockAgentPanel =
    APP_MOCK_ONLY &&
    ouroSlug != null &&
    (mockTrace.length > 0 ||
      (mockPhase != null && mockPhase !== "idle"))

  const remixEntries = useMemo(() => mockRemixListForItem(item), [item])

  const remixBarLeadText = useMemo(() => {
    if (commentTree.length > 0) return null
    const first = mockTrace[0]
    if (first?.kind === "user_line") return first.text
    return null
  }, [commentTree, mockTrace])

  const mockTraceForPanel = useMemo(() => {
    if (commentTree.length > 0) return mockTrace
    if (
      remixEntries.length > 0 &&
      mockTrace[0]?.kind === "user_line" &&
      remixBarLeadText
    ) {
      return mockTrace.slice(1)
    }
    return mockTrace
  }, [commentTree, mockTrace, remixEntries.length, remixBarLeadText])

  const showChatHistoryPanel =
    showMockAgentPanel && mockTraceForPanel.length > 0

  const chatHistoryContent = showChatHistoryPanel ? (
    <S.MockAgentChatSurface>
      <S.MockAgentActivity aria-live="polite">
        <MockAgentTraceList
          entries={mockTraceForPanel}
          visibleEndIndex={traceRevertEndIndex}
          onRevertToIndex={setTraceRevertEndIndex}
          onRestoreFullHistory={() => setTraceRevertEndIndex(null)}
        />
      </S.MockAgentActivity>
    </S.MockAgentChatSurface>
  ) : null

  /** Mobile drawer: prompts-only timeline (full trace stays in the main column). */
  const chatHistoryDrawerContent = showChatHistoryPanel ? (
    <S.MockAgentChatSurface>
      <S.MockAgentActivity aria-live="polite">
        <MockAgentPromptTimeline
          entries={mockTraceForPanel}
          visibleEndIndex={traceRevertEndIndex}
          onRevertToIndex={setTraceRevertEndIndex}
          onRestoreFullHistory={() => setTraceRevertEndIndex(null)}
        />
      </S.MockAgentActivity>
    </S.MockAgentChatSurface>
  ) : null

  return (
    <S.Page>
      <S.StickyHeader>
        <S.HeaderInner>
          <S.HeaderSlot $align="start">
            {showChatHistoryPanel && isMobileHeader ? (
              <S.ChatHistoryOpenButton
                type="button"
                aria-expanded={chatHistoryOpen}
                aria-controls="app-chat-history-drawer"
                onClick={onHistoryHeaderClick}
              >
                <ClockIcon strokeWidth={2} aria-hidden />
                History
              </S.ChatHistoryOpenButton>
            ) : (
              <S.BackLink to="/">
                <S.BackIcon>
                  <ArrowLeftIcon />
                </S.BackIcon>
                Feed
              </S.BackLink>
            )}
          </S.HeaderSlot>
          <S.HeaderTitle>{title}</S.HeaderTitle>
          <S.HeaderSlot $align="end">
            {showChatHistoryPanel && isMobileHeader ? (
              <S.BackLink to="/">
                <S.BackIcon>
                  <ArrowLeftIcon />
                </S.BackIcon>
                Feed
              </S.BackLink>
            ) : showChatHistoryPanel ? (
              <S.ChatHistoryOpenButton
                type="button"
                aria-expanded={isMobileHeader ? chatHistoryOpen : undefined}
                aria-controls={
                  isMobileHeader
                    ? "app-chat-history-drawer"
                    : WORKSPACE_HISTORY_SECTION_ID
                }
                onClick={onHistoryHeaderClick}
              >
                <ClockIcon strokeWidth={2} aria-hidden />
                History
              </S.ChatHistoryOpenButton>
            ) : null}
          </S.HeaderSlot>
        </S.HeaderInner>
      </S.StickyHeader>

      <S.DetailMain $ouroDock={ouroSlug != null}>
        <S.DetailGrid>
          <S.PrimaryColumn>
            {showWorkspacePreview ? (
              detailComposerMode === "create" ? (
                <AppPreviewPhoneExpand
                  previewKey={`${decodedId}-${(previewDisplayItem.previewHtml ?? "").length}-${previewDisplayItem.id}`}
                  previewHtml={previewDisplayItem.previewHtml}
                  title={
                    showRemixSourcePreview
                      ? `${previewDisplayItem.appName} — source app preview`
                      : `${previewDisplayItem.appName} preview`
                  }
                  variant="detail"
                />
              ) : (
                <S.PreviewFrame>
                  <S.PreviewIframe
                    key={`${decodedId}-${(previewDisplayItem.previewHtml ?? "").length}-${previewDisplayItem.id}`}
                    title={
                      showRemixSourcePreview
                        ? `${previewDisplayItem.appName} — source app preview`
                        : `${previewDisplayItem.appName} preview`
                    }
                    srcDoc={previewDisplayItem.previewHtml}
                    sandbox="allow-scripts"
                  />
                </S.PreviewFrame>
              )
            ) : null}

            <S.HeroMetaRow>
              <S.HeroTextCol>
                <S.HeroTitleLine>
                  <S.HeroTitleLead>
                    <S.TitleRow>
                      <S.TitleH1>{title}</S.TitleH1>
                      {ouroRunStatus ? (
                        <ProjectStatusPill status={ouroRunStatus} />
                      ) : null}
                    </S.TitleRow>
                  </S.HeroTitleLead>
                  {remixEntries.length > 0 ? (
                    <S.HeroRemixToggleSlot>
                      <S.RemixAsideToggleButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-expanded={remixAsideOpen}
                        title={
                          remixAsideOpen
                            ? "Hide other remixes"
                            : `Show other remixes (${remixEntries.length})`
                        }
                        aria-label={
                          remixAsideOpen
                            ? `Hide other remixes — ${remixEntries.length} listed`
                            : `Show other remixes — ${remixEntries.length} listed`
                        }
                        onClick={() => {
                          setRemixAsideOpen((v) => {
                            const next = !v
                            if (next) {
                              window.setTimeout(() => {
                                document.getElementById("remixes")?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                })
                              }, 0)
                            }
                            return next
                          })
                        }}
                      >
                        <S.RemixAsideToggleIcon>
                          <ShuffleIcon strokeWidth={2} aria-hidden />
                        </S.RemixAsideToggleIcon>
                        <S.RemixAsideToggleCount>
                          {remixEntries.length > 99 ? "99+" : remixEntries.length}
                        </S.RemixAsideToggleCount>
                      </S.RemixAsideToggleButton>
                    </S.HeroRemixToggleSlot>
                  ) : null}
                </S.HeroTitleLine>
                <S.SubMetaLine>
                  <S.SubMetaNums title={item.builderWallet}>
                    {abbreviateWalletAddress(item.builderWallet)}
                  </S.SubMetaNums>{" "}
                  · {formatShortTimeAgo(item.createdAt)} · {item.transactionId}
                </S.SubMetaLine>
              </S.HeroTextCol>
              {ouroSlug ? null : (
                <S.HeroActions>
                  <S.VoteGroup role="group" aria-label="Vote on this listing">
                    <S.VoteIconBtn
                      variant="vote"
                      voteDirection="up"
                      aria-label="Upvote"
                      aria-pressed={vote === "up"}
                      onClick={() => toggleVote("up")}
                    >
                      <S.VoteArrowWrap>
                        <VoteBlockArrowUp filled={vote === "up"} />
                      </S.VoteArrowWrap>
                    </S.VoteIconBtn>
                    <S.ScoreValue $tone={scoreTone(displayScore)} title="Score">
                      {formatCount(displayScore)}
                    </S.ScoreValue>
                    <S.VoteIconBtn
                      variant="vote"
                      voteDirection="down"
                      aria-label="Downvote"
                      aria-pressed={vote === "down"}
                      onClick={() => toggleVote("down")}
                    >
                      <S.VoteArrowWrap>
                        <VoteBlockArrowDown filled={vote === "down"} />
                      </S.VoteArrowWrap>
                    </S.VoteIconBtn>
                  </S.VoteGroup>
                </S.HeroActions>
              )}
            </S.HeroMetaRow>

            {showChatHistoryPanel ? (
              <S.ChatHistoryMainSection
                id={WORKSPACE_HISTORY_SECTION_ID}
                aria-label="Workspace chat"
              >
                {chatHistoryContent}
              </S.ChatHistoryMainSection>
            ) : null}

            {/*
              Detail tabs (Holders / Activity / Details) — restore when needed.
              <S.DetailTabs>…</S.DetailTabs>
            */}
            <S.CommentsSection id="comments" aria-label="Comments">
              {remixEntries.length > 0 ? (
                <S.RemixThreadWrap id="remixes" aria-label="Community remixes">
                  {remixBarLeadText ? (
                    <S.RemixThreadBar>
                      <S.RemixThreadBarLead>
                        <S.RemixThreadFirstSnippet title={remixBarLeadText}>
                          {remixBarLeadText}
                        </S.RemixThreadFirstSnippet>
                      </S.RemixThreadBarLead>
                    </S.RemixThreadBar>
                  ) : null}
                  {remixAsideOpen ? (
                    <S.RemixAsideList>
                      {remixEntries.map((r) => (
                        <li key={r.id}>
                          <S.RemixCardLink
                            to={detailStudioHref}
                            title={`Open studio — ${r.title}`}
                          >
                            <S.RemixThumb>
                              <S.RemixThumbIframe
                                srcDoc={r.previewHtml}
                                sandbox="allow-scripts"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                title=""
                              />
                            </S.RemixThumb>
                            <S.RemixCardBody>
                              <S.RemixCardTitle>{r.title}</S.RemixCardTitle>
                              <S.RemixCardMeta>
                                <S.RemixCardAuthor>{r.author}</S.RemixCardAuthor>
                                <span aria-hidden> · </span>
                                <span title={new Date(r.createdAt).toLocaleString()}>
                                  {formatShortTimeAgo(r.createdAt)}
                                </span>
                              </S.RemixCardMeta>
                              <S.RemixCardVotes>
                                {formatCount(r.score)} votes
                              </S.RemixCardVotes>
                            </S.RemixCardBody>
                          </S.RemixCardLink>
                        </li>
                      ))}
                    </S.RemixAsideList>
                  ) : null}
                </S.RemixThreadWrap>
              ) : null}
              <S.DetailChatComposerSheet $workspace={ouroSlug != null}>
                <form
                  onSubmit={(e) => {
                    void submitComposer(e)
                  }}
                >
                  <span className="sr-only" aria-live="polite" aria-atomic="true">
                    {detailComposerModeAnnounce}
                  </span>
                  <label htmlFor="detail-comment" className="sr-only">
                    {detailComposerLabel}
                  </label>
                  <S.DetailComposerWrapper
                    data-create-mode={
                      detailComposerMode === "create" ? "true" : "false"
                    }
                  >
                    <S.CommentComposerShell>
                      <S.DetailCreateContextTag>
                        <S.DetailCreateContextIcon>
                          <Send strokeWidth={2} aria-hidden />
                        </S.DetailCreateContextIcon>
                        <S.DetailCreateContextText>
                          {detailCreateContextLabel}
                        </S.DetailCreateContextText>
                      </S.DetailCreateContextTag>
                      <S.DetailComposerFieldRow>
                        <S.CommentComposerTextarea
                          id="detail-comment"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={onDetailComposerKeyDown}
                          rows={1}
                          placeholder={detailComposerPlaceholder}
                        />
                        <S.PostCommentFab
                          type="submit"
                          disabled={!draft.trim() || postBusy}
                          aria-label={detailComposerSubmitAria}
                          title={detailComposerSubmitTitle}
                        >
                          <S.PostCommentFabIcon>
                            <ArrowUpIcon strokeWidth={2.25} aria-hidden />
                          </S.PostCommentFabIcon>
                        </S.PostCommentFab>
                      </S.DetailComposerFieldRow>
                    </S.CommentComposerShell>
                  </S.DetailComposerWrapper>
                </form>
              </S.DetailChatComposerSheet>

              {comments.length === 0 ? (
                ouroSlug ? null : (
                  <S.EmptyComments>
                    <S.EmptyCommentsIcon>
                      <MessageSquare strokeWidth={1} aria-hidden />
                    </S.EmptyCommentsIcon>
                    <S.EmptyCommentsTitle>No comments yet</S.EmptyCommentsTitle>
                    <S.EmptyCommentsHint>
                      Be the first to add a comment
                    </S.EmptyCommentsHint>
                  </S.EmptyComments>
                )
              ) : (
                <CommentsStatRowList>
                  {commentTree.map((node) => (
                    <CommentThreadNode
                      key={node.id}
                      mode="detail"
                      node={node}
                      detail={{
                        ouroSlug,
                        replyingToId,
                        setReplyingToId,
                        replyDraft,
                        setReplyDraft,
                        submitReply,
                        toggleCommentVote,
                        onRemixFromComment: () => {
                          document
                            .getElementById("comments")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            })
                        },
                      }}
                      detailItem={{
                        appName: item.appName,
                        previewHtml: item.previewHtml,
                      }}
                      detailStudioHref={detailStudioHref}
                    />
                  ))}
                </CommentsStatRowList>
              )}
            </S.CommentsSection>
          </S.PrimaryColumn>
        </S.DetailGrid>
      </S.DetailMain>

      {showChatHistoryPanel ? (
        <S.ChatHistoryMobileRoot
          $open={chatHistoryOpen}
          aria-hidden={!chatHistoryOpen}
        >
          <S.ChatHistoryMobileBackdrop
            $visible={chatHistoryOpen}
            aria-label="Close history"
            onClick={() => setChatHistoryOpen(false)}
          />
          <S.ChatHistoryMobilePanel
            id="app-chat-history-drawer"
            $open={chatHistoryOpen}
            role="dialog"
            aria-modal="true"
            aria-label="Workspace prompt history"
          >
            <S.ChatHistoryMobileHeader>
              <S.ChatHistoryMobileTitle>History</S.ChatHistoryMobileTitle>
              <S.ChatHistoryCloseButton
                type="button"
                aria-label="Close history"
                onClick={() => setChatHistoryOpen(false)}
              >
                <XIcon strokeWidth={2} aria-hidden />
              </S.ChatHistoryCloseButton>
            </S.ChatHistoryMobileHeader>
            <S.ChatHistoryMobileScroll>{chatHistoryDrawerContent}</S.ChatHistoryMobileScroll>
          </S.ChatHistoryMobilePanel>
        </S.ChatHistoryMobileRoot>
      ) : null}
    </S.Page>
  )
}

export default AppDetailPage
