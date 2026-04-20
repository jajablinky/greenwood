import styled, { css } from "styled-components"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "components/atoms/Avatar"
import { Button } from "components/atoms/Button"
import { StatRowList } from "components/molecules/StatRow"

export const CommentsStatRowList = styled(StatRowList).attrs({ as: "ul" })`
  margin: 0;
  padding: 0;
  gap: 0.3125rem;
`

export const CommentThreadNest = styled.ul`
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
`

/**
 * Wraps one comment row + optional reply + replies so a single connector can run
 * from this comment’s avatar center down the thread (ends ~last reply avatar).
 */
export const CommentThreadBranch = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  &[data-has-replies]::before {
    content: "";
    position: absolute;
    z-index: 0;
    left: var(--comment-avatar-center-x);
    transform: translateX(-50%);
    /* Parent row: padding-block 0.5rem + avatar margin-top + half avatar */
    top: calc(0.5rem + 0.125rem + var(--comment-avatar-half, 1rem));
    /* Inset from branch bottom — larger = line stops higher (past last avatar) */
    bottom: 5.25rem;
    width: 1px;
    border-radius: 9999px;
    background: rgb(0 0 0 / 16%);
    pointer-events: none;

    @media (min-width: 640px) {
      bottom: 4.5rem;
    }

    .dark & {
      background: rgb(255 255 255 / 18%);
    }
  }

  /* Last reply is a leaf remix (tall card): end connector above the preview instead of through it */
  &[data-has-replies][data-thread-short-tail]::before {
    bottom: 19rem;

    @media (min-width: 640px) {
      bottom: 21rem;
    }
  }
`

export const CommentMiniVoteCol = styled.div`
  display: flex;
  width: 2.25rem;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding-top: 0.125rem;
`

export const CommentMiniVoteBtn = styled(Button).attrs({
  type: "button",
  size: "icon-xs",
})`
  flex-shrink: 0;
  border-radius: 50%;
  padding: 0;
  transition:
    background-color 120ms ease,
    color 120ms ease,
    transform 100ms ease;

  & svg {
    width: 14px;
    height: 14px;
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring) 45%, transparent);
  }
`

export const CommentMiniVoteScore = styled.span<{
  $tone: "positive" | "negative" | "neutral"
}>`
  font-size: 0.6875rem;
  line-height: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;

  ${(p) =>
    p.$tone === "positive" &&
    css`
      color: var(--color-alt-green-deep);
    `}
  ${(p) =>
    p.$tone === "negative" &&
    css`
      color: var(--color-alt-red-deep);
    `}
  ${(p) =>
    p.$tone === "neutral" &&
    css`
      color: var(--muted-foreground);
    `}
`

export const CommentMainRow = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 1 0%;
  align-items: flex-start;
  gap: 0.75rem;
`

export const CommentThreadRootLi = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;
  /* Vote column + row gap + half avatar — center of thread connector line */
  --comment-avatar-center-x: calc(2.25rem + 0.5rem + 0.875rem);
  --comment-avatar-half: 0.875rem;
  /* Reply composer aligns with avatar (vote col + StatRow gap) */
  --comment-content-inset-left: calc(2.25rem + 0.5rem);

  @media (min-width: 640px) {
    --comment-avatar-center-x: calc(2.25rem + 0.5rem + 1rem);
    --comment-avatar-half: 1rem;
  }
`

export const CommentStatRow = styled.div<{ $highlighted?: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding-block: 0.5rem;
  padding-inline: 0;
  border-radius: var(--radius-lg);
  transition: box-shadow 150ms ease, background-color 150ms ease;

  ${(p) =>
    p.$highlighted &&
    css`
      background: color-mix(in oklab, oklch(0.75 0.12 230) 90%, transparent);
      box-shadow:
        0 0 0 2px color-mix(in oklab, oklch(0.7 0.15 230) 50%, transparent),
        0 0 0 4px var(--background);

      .dark & {
        background: color-mix(in oklab, oklch(0.35 0.08 230) 40%, transparent);
        box-shadow: 0 0 0 2px color-mix(in oklab, oklch(0.55 0.12 230) 40%, transparent),
          0 0 0 4px var(--background);
      }
    `}
`

export const CommentReplyRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`

/**
 * Detail-style inline composer: no border until focus; send control is icon-only (arrow).
 * Collapsed until focus — shell expands min-height when :focus-within.
 * Shared by AppDetail root composer and thread replies.
 */
export const InlineComposerTextarea = styled.textarea`
  /* One line + existing padding; stays below expanded 5.5rem */
  min-height: 3.125rem;
  width: 100%;
  resize: none;
  border-radius: var(--radius-2xl);
  border: 0;
  background: #fff;
  padding: calc(
      var(--comment-fab-top) + var(--comment-fab-height) / 2 - 0.625rem
    )
    0.75rem 0.75rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--foreground);
  text-align: start;
  outline: none;
  box-shadow: none;
  transition:
    min-height 200ms cubic-bezier(0.4, 0, 0.2, 1),
    padding-right 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring) 30%, transparent);
  }

  .dark & {
    background: var(--background);
  }
`

export const InlineComposerFab = styled(Button).attrs({
  type: "button",
  variant: "ghost",
})`
  position: absolute;
  top: var(--comment-fab-top, 0.625rem);
  right: 0.625rem;
  display: inline-flex;
  width: var(--comment-fab-height, 2.25rem);
  height: var(--comment-fab-height, 2.25rem);
  min-height: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0;
  border-radius: 50%;
  background: color-mix(in oklab, var(--foreground) 10%, transparent);
  color: var(--foreground);
  box-shadow: none;
  transition:
    transform 120ms ease,
    background-color 150ms ease,
    opacity 150ms ease;

  &:hover {
    background: color-mix(in oklab, var(--foreground) 16%, transparent);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    box-shadow:
      0 0 0 2px var(--ring),
      0 0 0 4px var(--background);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.35;
  }

  .dark & {
    background: rgb(255 255 255 / 12%);
  }

  .dark &:hover {
    background: rgb(255 255 255 / 18%);
  }
`

export const InlineComposerFabIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export const InlineComposerShell = styled.div`
  position: relative;
  --comment-fab-top: 0.625rem;
  --comment-fab-height: 2.25rem;

  ${InlineComposerFab} {
    display: none;
  }

  &:focus-within ${InlineComposerFab} {
    display: inline-flex;
  }

  &:focus-within ${InlineComposerTextarea} {
    min-height: 5.5rem;
    padding-right: 3rem;
  }
`

/** Shared with feed "Add a comment" — same layout and chrome; copy differs in JSX. */
export const CommentComposerForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
  }
`

export const CommentComposerTextarea = styled.textarea`
  min-height: 72px;
  width: 100%;
  flex: 1 1 0%;
  resize: none;
  border-radius: var(--radius-xl);
  border: 1px solid rgb(0 0 0 / 8%);
  background: #fff;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--foreground);
  outline: none;
  box-shadow: 0 0 0 0 transparent;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring) 30%, transparent);
  }

  .dark & {
    border-color: rgb(255 255 255 / 12%);
    background: var(--background);
  }
`

export const CommentComposerSubmit = styled(Button)`
  flex-shrink: 0;
  @media (min-width: 640px) {
    margin-bottom: 0.125rem;
  }
`

export const CommentReplyForm = styled.form`
  margin-top: 0.5rem;
  padding-left: var(--comment-content-inset-left);
  box-sizing: border-box;
`

export const CommentAvatarLink = styled(Link)`
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 0.125rem;
  line-height: 0;
  border-radius: 9999px;
  text-decoration: none;
  color: inherit;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--ring);
  }
`

export const CommentAvatar = styled(Avatar)`
  aspect-ratio: 1;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 9999px;

  &::after {
    border-radius: 9999px;
  }

  @media (min-width: 640px) {
    width: 2rem;
    height: 2rem;
  }
`

export const CommentAvatarFallback = styled(AvatarFallback)`
  border-radius: inherit;
  font-size: 10px;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: 11px;
  }
`

export const CommentBlock = styled.div`
  min-width: 0;
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const CommentMeta = styled.p`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--muted-foreground);
`

export const CommentMetaDot = styled.span`
  display: inline-block;
  width: 2px;
  height: 2px;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.6;
`

export const CommentAuthor = styled.span`
  font-weight: 600;
  color: var(--foreground);
`

export const CommentKindBadge = styled.span<{ $kind: "comment" | "remix" }>`
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  padding: 0.0625rem 0.375rem;
  font-size: 0.625rem;
  line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;

  ${(p) =>
    p.$kind === "remix" &&
    css`
      background: color-mix(in oklab, oklch(0.55 0.18 280) 18%, transparent);
      color: oklch(0.42 0.2 280);
      .dark & {
        background: color-mix(in oklab, oklch(0.7 0.14 280) 22%, transparent);
        color: oklch(0.82 0.1 280);
      }
    `}

  ${(p) =>
    p.$kind === "comment" &&
    css`
      background: color-mix(in oklab, var(--foreground) 6%, transparent);
      color: var(--muted-foreground);
    `}
`

export const CommentBody = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.375rem;
  color: color-mix(in oklab, var(--foreground) 92%, transparent);
  overflow-wrap: anywhere;
`

/** Fork label + prompt excerpt above the remix preview iframe. */
export const RemixForkSummary = styled.div`
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`

export const RemixForkAppName = styled.span`
  font-size: 0.8125rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: color-mix(in oklab, var(--foreground) 94%, transparent);
`

export const RemixForkPrompt = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--muted-foreground);
  overflow-wrap: anywhere;
`

export const RemixStudioPreviewLink = styled(Link)`
  position: relative;
  margin-top: 0.5rem;
  display: block;
  width: 5rem;
  height: 3rem;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid rgb(0 0 0 / 8%);
  background: var(--muted);
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
  outline: none;
  transition:
    opacity 150ms ease,
    box-shadow 150ms ease;

  .dark & {
    border-color: rgb(255 255 255 / 12%);
  }

  &:hover {
    opacity: 0.95;
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring) 35%, transparent);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--ring);
  }
`

export const RemixPreviewIframe = styled.iframe`
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  border: 0;
`

export const RemixActionsRow = styled.div`
  margin-top: 0.5rem;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`

export const RemixViewAppLink = styled(Link)`
  font-size: 11px;
  line-height: 1rem;
  font-weight: 500;
  color: oklch(0.45 0.12 230);
  text-underline-offset: 2px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  .dark & {
    color: oklch(0.78 0.1 230);
  }
`

export const RemixOutlineButton = styled(Button)`
  height: 1.75rem;
  padding-inline: 0.625rem;
  font-size: 11px;
  line-height: 1rem;
  font-weight: 500;
`

export const ViewMoreCommentsRow = styled.div`
  margin-top: 0.25rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`

export const ViewMoreCommentsButton = styled(Button).attrs({
  type: "button",
  variant: "link",
  size: "sm",
})`
  margin: 0;
  height: auto;
  min-height: 0;
  padding: 0;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  color: oklch(0.45 0.12 230);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .dark & {
    color: oklch(0.78 0.1 230);
  }

  &:focus-visible {
    border-radius: 2px;
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring) 45%, transparent);
  }
`

export const OpenDetailCommentsLink = styled(Link)`
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  color: var(--muted-foreground);
  text-decoration: none;
  outline: none;

  &:hover {
    color: var(--foreground);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  &:focus-visible {
    border-radius: 2px;
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring) 45%, transparent);
  }
`
