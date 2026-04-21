import type { FormEvent } from "react"
import { useCallback, useState } from "react"

import { ArrowUpIcon, Globe, ShuffleIcon } from "assets/icons"

import { VoteBlockArrowDown, VoteBlockArrowUp } from "components/atoms/VoteBlockArrows"
import { Button } from "components/atoms/Button"
import type { FeedComment } from "helpers/activity-feed-mock-data"
import type { GlobalFeedItem } from "helpers/activity-feed-mock-data"
import {
  commentDisplayScore,
  countDescendantComments,
  scoreToneForComment,
  type CommentTreeNode,
} from "helpers/comment-tree"
import { formatCount } from "helpers/format-count"
import { formatShortTimeAgo } from "helpers/format-short-time-ago"
import { buildMiniAppPreviewHtml } from "helpers/feed-mini-app-previews"
import { profilePathForAuthor } from "helpers/profile-path"
import { parseRemixComment, slicePrompt } from "helpers/remix-comment"

import * as S from "./styles"

export type FeedReplyTarget = { postId: string; parentId: string }

export type CommentThreadDetailCtx = {
  ouroSlug: string | null
  replyingToId: string | null
  setReplyingToId: (
    v: string | null | ((cur: string | null) => string | null),
  ) => void
  replyDraft: string
  setReplyDraft: (v: string | ((s: string) => string)) => void
  submitReply: (e: FormEvent, parentId: string) => void
  toggleCommentVote: (commentId: string, direction: "up" | "down") => void
  /** e.g. scroll to remix panel on detail page */
  onRemixFromComment?: () => void
}

type FeedCtx = {
  postId: string
  item: GlobalFeedItem
  studioHref: string
  highlightComment: { postId: string; commentId: string } | null
  feedReplyTarget: FeedReplyTarget | null
  setFeedReplyTarget: React.Dispatch<
    React.SetStateAction<FeedReplyTarget | null>
  >
  feedReplyDraft: string
  setFeedReplyDraft: (v: string | ((s: string) => string)) => void
  toggleFeedCommentVote: (
    postId: string,
    commentId: string,
    direction: "up" | "down",
  ) => void
  submitFeedReply: (e: FormEvent, postId: string) => void
  /** Opens create-app flow with this feed post as the remix source. */
  onOpenRemixCreate: () => void
}

type DetailProps = {
  mode: "detail"
  node: CommentTreeNode
  detail: CommentThreadDetailCtx
  detailItem: Pick<GlobalFeedItem, "appName" | "previewHtml">
  detailStudioHref: string
}

type FeedProps = {
  mode: "feed"
  node: CommentTreeNode
  feed: FeedCtx
}

export type CommentThreadNodeProps = DetailProps | FeedProps

export function CommentThreadNode(props: CommentThreadNodeProps) {
  const { node, mode } = props
  const [threadHidden, setThreadHidden] = useState(false)
  const replyCount = countDescendantComments(node.children)
  const hasReplies = node.children.length > 0
  const vv = node.viewerVote
  const display = commentDisplayScore(node as FeedComment)
  const tone = scoreToneForComment(display)
  const remixParsed = parseRemixComment(node.body)
  const isRemix = remixParsed.isRemix

  const lastDirectChild =
    node.children.length > 0
      ? node.children[node.children.length - 1]
      : undefined
  /** Tall remix leaf: shorten parent connector so the line doesn’t run through the whole preview block. */
  const threadLineShortTail =
    lastDirectChild !== undefined &&
    lastDirectChild.children.length === 0 &&
    parseRemixComment(lastDirectChild.body).isRemix

  const showReplyForm =
    mode === "detail"
      ? !props.detail.ouroSlug && props.detail.replyingToId === node.id
      : props.feed.feedReplyTarget?.postId === props.feed.postId &&
        props.feed.feedReplyTarget.parentId === node.id

  const highlighted =
    mode === "feed" &&
    props.feed.highlightComment?.postId === props.feed.postId &&
    props.feed.highlightComment.commentId === node.id

  function onVoteUp() {
    if (mode === "detail") {
      props.detail.toggleCommentVote(node.id, "up")
    } else {
      props.feed.toggleFeedCommentVote(props.feed.postId, node.id, "up")
    }
  }

  function onVoteDown() {
    if (mode === "detail") {
      props.detail.toggleCommentVote(node.id, "down")
    } else {
      props.feed.toggleFeedCommentVote(props.feed.postId, node.id, "down")
    }
  }

  function onReplyClick() {
    if (mode === "detail") {
      props.detail.setReplyingToId((cur) => {
        if (cur === node.id) {
          props.detail.setReplyDraft("")
          return null
        }
        props.detail.setReplyDraft("")
        return node.id
      })
    } else {
      const { postId } = props.feed
      props.feed.setFeedReplyTarget((cur) => {
        if (cur?.postId === postId && cur.parentId === node.id) {
          props.feed.setFeedReplyDraft("")
          return null
        }
        props.feed.setFeedReplyDraft("")
        return { postId, parentId: node.id }
      })
    }
  }

  const appName =
    mode === "feed" ? props.feed.item.appName : props.detailItem.appName
  const previewHtml =
    mode === "feed" ? props.feed.item.previewHtml : props.detailItem.previewHtml
  const studioHref =
    mode === "feed" ? props.feed.studioHref : props.detailStudioHref

  const remixDisplayName =
    isRemix && remixParsed.forkAppName ? remixParsed.forkAppName : appName
  const remixIframeSrcDoc =
    isRemix && remixParsed.forkAppName
      ? buildMiniAppPreviewHtml(`remix-${node.id}`, remixParsed.forkAppName)
      : previewHtml
  const remixPromptExcerpt =
    isRemix ? slicePrompt(remixParsed.promptSlice, 160) : ""

  function onRemixSecondary() {
    if (mode === "feed") {
      props.feed.onOpenRemixCreate()
    } else {
      props.detail.onRemixFromComment?.()
    }
  }

  const toggleThreadHidden = useCallback(() => {
    setThreadHidden((h) => !h)
  }, [])

  const hideCommentVotes =
    mode === "detail" && props.detail.ouroSlug !== null

  const inner = (
    <>
      {hideCommentVotes ? null : (
        <S.CommentMiniVoteCol>
          <S.CommentMiniVoteBtn
            variant="vote"
            voteDirection="up"
            aria-label="Upvote comment"
            aria-pressed={vv === "up"}
            onClick={onVoteUp}
          >
            <VoteBlockArrowUp filled={vv === "up"} />
          </S.CommentMiniVoteBtn>
          <S.CommentMiniVoteScore $tone={tone}>
            {formatCount(display)}
          </S.CommentMiniVoteScore>
          <S.CommentMiniVoteBtn
            variant="vote"
            voteDirection="down"
            aria-label="Downvote comment"
            aria-pressed={vv === "down"}
            onClick={onVoteDown}
          >
            <VoteBlockArrowDown filled={vv === "down"} />
          </S.CommentMiniVoteBtn>
        </S.CommentMiniVoteCol>
      )}
      <S.CommentMainRow>
        <S.CommentAvatarLink
          to={profilePathForAuthor(node.author)}
          aria-label={`Open ${node.author} profile`}
          title={node.author}
        >
          <S.CommentAvatar>
            <S.CommentAvatarFallback>{node.authorInitials}</S.CommentAvatarFallback>
          </S.CommentAvatar>
        </S.CommentAvatarLink>
        <S.CommentBlock>
          {isRemix ? (
            <S.CommentRemixMetaBar>
              <S.CommentMetaLead>
                <S.CommentMeta>
                  <S.CommentAuthor>{node.author}</S.CommentAuthor>
                  <S.CommentKindBadge $kind="remix">Remix</S.CommentKindBadge>
                  <S.CommentMetaDot aria-hidden />
                  <time>{formatShortTimeAgo(node.createdAt)}</time>
                </S.CommentMeta>
              </S.CommentMetaLead>
              <S.RemixActionsRow>
                <S.RemixViewAppLink
                  to={studioHref}
                  title={`Open ${remixDisplayName} in studio`}
                  aria-label={`View app in studio — ${remixDisplayName}`}
                >
                  <Globe width={16} height={16} strokeWidth={2} aria-hidden />
                </S.RemixViewAppLink>
                <S.RemixThreadIconButton
                  onClick={onRemixSecondary}
                  title="Remix"
                  aria-label={`Remix ${remixDisplayName}`}
                >
                  <ShuffleIcon width={16} height={16} strokeWidth={2} aria-hidden />
                </S.RemixThreadIconButton>
              </S.RemixActionsRow>
            </S.CommentRemixMetaBar>
          ) : (
            <S.CommentMeta>
              <S.CommentAuthor>{node.author}</S.CommentAuthor>
              <S.CommentKindBadge $kind="comment">Comment</S.CommentKindBadge>
              <S.CommentMetaDot aria-hidden />
              <time>{formatShortTimeAgo(node.createdAt)}</time>
            </S.CommentMeta>
          )}
          {!isRemix ? <S.CommentBody>{node.body}</S.CommentBody> : null}
          {isRemix ? (
            <>
              <S.RemixForkSummary>
                <S.RemixForkAppName>{remixDisplayName}</S.RemixForkAppName>
                <S.RemixForkPrompt>{remixPromptExcerpt}</S.RemixForkPrompt>
              </S.RemixForkSummary>
              <S.RemixStudioPreviewLink
                to={studioHref}
                aria-label={`Preview ${remixDisplayName} (studio)`}
                title={`Preview ${remixDisplayName} (studio)`}
              >
                <S.RemixPreviewIframe
                  srcDoc={remixIframeSrcDoc}
                  sandbox="allow-scripts"
                  title=""
                  style={{
                    width: 400,
                    height: 225,
                    transform: "scale(0.25)",
                    transformOrigin: "0 0",
                  }}
                />
              </S.RemixStudioPreviewLink>
            </>
          ) : null}
          {(mode === "detail" && !props.detail.ouroSlug) || mode === "feed" ? (
            <S.CommentReplyRow>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={onReplyClick}
              >
                Reply
              </Button>
              {hasReplies ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  aria-expanded={!threadHidden}
                  aria-controls={
                    threadHidden
                      ? undefined
                      : mode === "feed"
                        ? `feed-replies-${props.feed.postId}-${node.id}`
                        : `detail-replies-${node.id}`
                  }
                  onClick={toggleThreadHidden}
                >
                  {threadHidden
                    ? `Show thread (${replyCount})`
                    : "Hide thread"}
                </Button>
              ) : null}
            </S.CommentReplyRow>
          ) : null}
        </S.CommentBlock>
      </S.CommentMainRow>
    </>
  )

  const replyForm =
    mode === "detail" ? (
      showReplyForm ? (
        <S.CommentReplyForm
          onSubmit={(e) => props.detail.submitReply(e, node.id)}
        >
          <label className="sr-only" htmlFor={`reply-${node.id}`}>
            Write a reply
          </label>
          <S.InlineComposerShell $quietUntilFocus>
            <S.InlineComposerTextarea
              id={`reply-${node.id}`}
              rows={1}
              placeholder="Write a reply…"
              value={props.detail.replyDraft}
              onChange={(e) => props.detail.setReplyDraft(e.target.value)}
            />
            <S.InlineComposerFab
              type="submit"
              disabled={!props.detail.replyDraft.trim()}
              aria-label="Post reply"
              title="Post reply"
            >
              <S.InlineComposerFabIcon>
                <ArrowUpIcon strokeWidth={2.25} aria-hidden />
              </S.InlineComposerFabIcon>
            </S.InlineComposerFab>
          </S.InlineComposerShell>
        </S.CommentReplyForm>
      ) : null
    ) : showReplyForm ? (
      <S.CommentReplyForm
        onSubmit={(e) => props.feed.submitFeedReply(e, props.feed.postId)}
      >
        <label
          className="sr-only"
          htmlFor={`feed-reply-${props.feed.postId}-${node.id}`}
        >
          Write a reply
        </label>
        <S.InlineComposerShell $quietUntilFocus>
          <S.InlineComposerTextarea
            id={`feed-reply-${props.feed.postId}-${node.id}`}
            rows={1}
            placeholder="Write a reply…"
            value={props.feed.feedReplyDraft}
            onChange={(e) => props.feed.setFeedReplyDraft(e.target.value)}
          />
          <S.InlineComposerFab
            type="submit"
            disabled={!props.feed.feedReplyDraft.trim()}
            aria-label="Post reply"
            title="Post reply"
          >
            <S.InlineComposerFabIcon>
              <ArrowUpIcon strokeWidth={2.25} aria-hidden />
            </S.InlineComposerFabIcon>
          </S.InlineComposerFab>
        </S.InlineComposerShell>
      </S.CommentReplyForm>
    ) : null

  const liProps =
    mode === "feed"
      ? { id: `feed-comment-${props.feed.postId}-${node.id}` as const }
      : {}

  return (
    <S.CommentThreadRootLi
      $detailChatFlow={hideCommentVotes}
      {...liProps}
    >
      <S.CommentThreadBranch
        data-has-replies={
          hasReplies && !threadHidden ? "" : undefined
        }
        data-thread-short-tail={
          hasReplies && !threadHidden && threadLineShortTail ? "" : undefined
        }
      >
        <S.CommentStatRow $highlighted={mode === "feed" ? highlighted : false}>
          {inner}
        </S.CommentStatRow>
        {replyForm}
        {hasReplies && !threadHidden ? (
          <S.CommentThreadNest
            id={
              mode === "feed"
                ? `feed-replies-${props.feed.postId}-${node.id}`
                : `detail-replies-${node.id}`
            }
          >
            {node.children.map((ch) => (
              <CommentThreadNode
                key={ch.id}
                {...(mode === "detail"
                  ? ({
                      mode: "detail",
                      node: ch,
                      detail: props.detail,
                      detailItem: props.detailItem,
                      detailStudioHref: props.detailStudioHref,
                    } satisfies DetailProps)
                  : ({
                      mode: "feed",
                      node: ch,
                      feed: props.feed,
                    } satisfies FeedProps))}
              />
            ))}
          </S.CommentThreadNest>
        ) : null}
      </S.CommentThreadBranch>
    </S.CommentThreadRootLi>
  )
}
