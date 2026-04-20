import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { ArrowLeftIcon, ArrowUpIcon, MessageSquare, Send } from "assets/icons"
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
import { INITIAL_ACTIVITY_FEED, type FeedComment } from "helpers/activity-feed-mock-data"
import { buildCommentTree } from "helpers/comment-tree"
import { formatCount } from "helpers/format-count"
import { abbreviateWalletAddress } from "helpers/abbrev-wallet"
import { formatShortTimeAgo } from "helpers/format-short-time-ago"
import { mockWorkspaceSnapshotFromName } from "helpers/mock-workspace-snapshot"
import {
  remixDescription,
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

type AppDetailLocationState = { scrollToComments?: boolean } | null

export function AppDetailPage() {
  const { feedId = "" } = useParams<{ feedId: string }>()
  const decodedId = decodeURIComponent(feedId)
  const location = useLocation()
  const navigate = useNavigate()
  const { push } = useToaster()
  const { walletAddress, connect } = useArweaveProvider()
  const { ouroFeedItems, addWorkspace, getStatusForSlug, getThoughtLog } =
    useProjects()

  const item = useMemo(
    () =>
      INITIAL_ACTIVITY_FEED.find((x) => x.id === decodedId) ??
      ouroFeedItems.find((x) => x.id === decodedId) ??
      null,
    [decodedId, ouroFeedItems],
  )

  const ouroSlug = workspaceSlugFromFeedId(decodedId)
  const thoughtLines = ouroSlug ? getThoughtLog(ouroSlug) : []
  const ouroRunStatus: ProjectRunStatus | undefined = ouroSlug
    ? getStatusForSlug(ouroSlug) ?? "idle"
    : undefined

  const [vote, setVote] = useState<ViewerVote>(null)
  const [comments, setComments] = useState<FeedComment[]>([])
  const [draft, setDraft] = useState("")
  const [postBusy, setPostBusy] = useState(false)
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState("")

  useEffect(() => {
    const init =
      INITIAL_ACTIVITY_FEED.find((x) => x.id === decodedId)?.initialComments ??
      ouroFeedItems.find((x) => x.id === decodedId)?.initialComments ??
      []
    setComments(init)
  }, [decodedId, ouroFeedItems])

  useEffect(() => {
    const st = location.state as AppDetailLocationState
    if (!st?.scrollToComments) return
    const t = window.setTimeout(() => {
      document.getElementById("comments")?.scrollIntoView({
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
    if (!raw) return

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
      : "Message #general (team lead sees it)…"
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
        ? "Send to #general"
        : "Post comment"

  const detailCreateContextLabel =
    item.cardTitle && item.cardTitle !== item.appName
      ? `${item.appName} — ${item.cardTitle}`
      : title

  return (
    <S.Page>
      <S.StickyHeader>
        <S.HeaderInner>
          <S.BackLink to="/">
            <S.BackIcon>
              <ArrowLeftIcon />
            </S.BackIcon>
            Feed
          </S.BackLink>
          <S.HeaderTitle>{title}</S.HeaderTitle>
        </S.HeaderInner>
      </S.StickyHeader>

      <S.DetailMain>
        <S.DetailGrid>
          <S.PrimaryColumn>
            <S.PreviewFrame>
              <S.PreviewIframe
                title={`${item.appName} preview`}
                srcDoc={item.previewHtml}
                sandbox="allow-scripts"
              />
            </S.PreviewFrame>

            <S.HeroMetaRow>
              <S.HeroTextCol>
                <S.TitleRow>
                  <S.TitleH1>{title}</S.TitleH1>
                  {ouroRunStatus ? (
                    <ProjectStatusPill status={ouroRunStatus} />
                  ) : null}
                </S.TitleRow>
                <S.SubMetaLine>
                  <S.SubMetaNums title={item.builderWallet}>
                    {abbreviateWalletAddress(item.builderWallet)}
                  </S.SubMetaNums>{" "}
                  · {formatShortTimeAgo(item.createdAt)} · {item.transactionId}
                </S.SubMetaLine>
              </S.HeroTextCol>
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
            </S.HeroMetaRow>

            {/*
              Detail tabs (Holders / Activity / Details) — restore when needed.
              <S.DetailTabs>…</S.DetailTabs>
            */}
            <S.CommentsSection id="comments" aria-label="Comments">
                {ouroSlug ? (
                  <S.ThoughtPanel aria-live="polite">
                    <S.ThoughtPanelLabel>Team lead (streaming)</S.ThoughtPanelLabel>
                    <S.ThoughtPre>
                      {thoughtLines.length > 0
                        ? thoughtLines.join("")
                        : "Waiting for agent output…"}
                    </S.ThoughtPre>
                  </S.ThoughtPanel>
                ) : null}
                <form onSubmit={(e) => void submitComposer(e)}>
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

                {comments.length === 0 ? (
                  <S.EmptyComments>
                    <S.EmptyCommentsIcon>
                      <MessageSquare strokeWidth={1} aria-hidden />
                    </S.EmptyCommentsIcon>
                    <S.EmptyCommentsTitle>No comments yet</S.EmptyCommentsTitle>
                    <S.EmptyCommentsHint>
                      Be the first to add a comment
                    </S.EmptyCommentsHint>
                  </S.EmptyComments>
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
    </S.Page>
  )
}

export default AppDetailPage
