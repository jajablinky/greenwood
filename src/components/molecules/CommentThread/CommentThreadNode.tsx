import type { FormEvent } from "react"

import { ArrowUpIcon } from "lucide-react"

import { VoteBlockArrowDown, VoteBlockArrowUp } from "components/atoms/VoteBlockArrows"
import { Button } from "components/atoms/Button"
import type { FeedComment } from "helpers/activity-feed-mock-data"
import type { GlobalFeedItem } from "helpers/activity-feed-mock-data"
import {
  commentDisplayScore,
  scoreToneForComment,
  type CommentTreeNode,
} from "helpers/comment-tree"
import { formatCount } from "helpers/format-count"
import { formatShortTimeAgo } from "helpers/format-short-time-ago"
import { isRemixCommentBody } from "helpers/remix-comment"

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
  setRemixText: (v: string | ((s: string) => string)) => void
  setRemixListPostId: (v: string | null | ((s: string | null) => string | null)) => void
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
  const vv = node.viewerVote
  const display = commentDisplayScore(node as FeedComment)
  const tone = scoreToneForComment(display)
  const isRemix = isRemixCommentBody(node.body)

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

  function onRemixSecondary() {
    if (mode === "feed") {
      props.feed.setRemixText("")
      props.feed.setRemixListPostId(props.feed.postId)
    } else {
      props.detail.onRemixFromComment?.()
    }
  }

  const inner = (
    <>
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
        <S.CommentMiniVoteScore $tone={tone}>{formatCount(display)}</S.CommentMiniVoteScore>
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
      <S.CommentMainRow>
        <S.CommentAvatar>
          <S.CommentAvatarFallback>{node.authorInitials}</S.CommentAvatarFallback>
        </S.CommentAvatar>
        <S.CommentBlock>
          <S.CommentMeta>
            <S.CommentAuthor>{node.author}</S.CommentAuthor>
            <S.CommentKindBadge $kind={isRemix ? "remix" : "comment"}>
              {isRemix ? "Remix" : "Comment"}
            </S.CommentKindBadge>
            <S.CommentMetaDot aria-hidden />
            <time>{formatShortTimeAgo(node.createdAt)}</time>
          </S.CommentMeta>
          <S.CommentBody>{node.body}</S.CommentBody>
          {isRemix ? (
            <>
              <S.RemixStudioPreviewLink
                to={studioHref}
                aria-label={`View ${appName} in studio`}
                title={`View ${appName} in studio`}
              >
                <S.RemixPreviewIframe
                  srcDoc={previewHtml}
                  sandbox="allow-scripts"
                  title=""
                  style={{
                    width: 400,
                    height: 225,
                    transform: "scale(0.2)",
                    transformOrigin: "0 0",
                  }}
                />
              </S.RemixStudioPreviewLink>
              <S.RemixActionsRow>
                <S.RemixViewAppLink to={studioHref}>View app</S.RemixViewAppLink>
                <S.RemixOutlineButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRemixSecondary}
                >
                  Remix
                </S.RemixOutlineButton>
              </S.RemixActionsRow>
            </>
          ) : null}
          {(mode === "detail" && !props.detail.ouroSlug) || mode === "feed" ? (
            <S.CommentReplyRow>
              <Button type="button" size="sm" onClick={onReplyClick}>
                Reply
              </Button>
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
          <S.InlineComposerShell>
            <S.InlineComposerTextarea
              id={`reply-${node.id}`}
              rows={3}
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
              <S.InlineComposerFabLabel aria-hidden>Reply</S.InlineComposerFabLabel>
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
        <S.InlineComposerShell>
          <S.InlineComposerTextarea
            id={`feed-reply-${props.feed.postId}-${node.id}`}
            rows={3}
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
            <S.InlineComposerFabLabel aria-hidden>Reply</S.InlineComposerFabLabel>
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
    <S.CommentThreadRootLi {...liProps}>
      {mode === "feed" ? (
        <S.ThreadRowInner $highlighted={highlighted}>{inner}</S.ThreadRowInner>
      ) : (
        <S.CommentStatRow>{inner}</S.CommentStatRow>
      )}
      {replyForm}
      {node.children.length > 0 ? (
        <S.CommentThreadNest>
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
    </S.CommentThreadRootLi>
  )
}
