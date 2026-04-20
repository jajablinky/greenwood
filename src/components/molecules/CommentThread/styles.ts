import styled, { css } from "styled-components"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "components/atoms/Avatar"
import { Button } from "components/atoms/Button"
import { StatRowList } from "components/molecules/StatRow"

export const CommentsStatRowList = styled(StatRowList).attrs({ as: "ul" })`
  margin: 1.25rem 0 0;
  padding: 0;
  gap: 0.3125rem;
`

export const CommentThreadNest = styled.ul`
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0 0 0 0.875rem;
  border-left: 1px solid rgb(0 0 0 / 8%);

  .dark & {
    border-color: rgb(255 255 255 / 10%);
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
`

export const CommentStatRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding-block: 0.5rem;
  padding-inline: 0;
`

/** Feed: highlight ring; detail: omit $highlighted. */
export const ThreadRowInner = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  gap: 0.5rem;
  border-radius: var(--radius-lg);
  padding: 0.125rem 0.25rem;
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
 * Detail-style inline composer: no border until focus; FAB label + arrow collapses when focused.
 * Shared by AppDetail root composer and thread replies.
 */
export const InlineComposerTextarea = styled.textarea`
  min-height: 88px;
  width: 100%;
  resize: none;
  border-radius: var(--radius-2xl);
  border: 0;
  background: #fff;
  padding: calc(
      var(--comment-fab-top) + var(--comment-fab-height) / 2 - 0.625rem
    )
    3rem 0.75rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--foreground);
  text-align: start;
  outline: none;
  box-shadow: none;
  transition: padding-right 220ms cubic-bezier(0.4, 0, 0.2, 1);

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

export const InlineComposerFabLabel = styled.span`
  display: inline-block;
  overflow: hidden;
  flex-shrink: 1;
  min-width: 0;
  max-width: 6rem;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.01em;
  white-space: nowrap;
  opacity: 1;
  transition:
    max-width 220ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 160ms ease;
`

export const InlineComposerFab = styled(Button).attrs({
  type: "button",
  variant: "ghost",
})`
  position: absolute;
  top: var(--comment-fab-top, 0.625rem);
  right: 0.625rem;
  display: inline-flex;
  width: 7.25rem;
  height: var(--comment-fab-height, 2.25rem);
  min-height: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
  padding: 0 0.5rem 0 0.625rem;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--foreground) 10%, transparent);
  color: var(--foreground);
  box-shadow: none;
  transition:
    width 220ms cubic-bezier(0.4, 0, 0.2, 1),
    padding 220ms cubic-bezier(0.4, 0, 0.2, 1),
    gap 220ms cubic-bezier(0.4, 0, 0.2, 1),
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

  &:not(:focus-within) ${InlineComposerTextarea} {
    padding-right: 7.75rem;
  }

  &:focus-within ${InlineComposerTextarea} {
    padding-right: 3rem;
  }

  &:focus-within ${InlineComposerFab} {
    width: 2.25rem;
    gap: 0;
    padding: 0;
    justify-content: center;
  }

  &:focus-within ${InlineComposerFabLabel} {
    max-width: 0;
    opacity: 0;
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
`

export const CommentAvatar = styled(Avatar)`
  aspect-ratio: 1;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 9999px;
  margin-top: 0.125rem;

  &::after {
    border-radius: 9999px;
  }
`

export const CommentAvatarFallback = styled(AvatarFallback)`
  border-radius: inherit;
  font-size: 11px;
  font-weight: 600;
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
  letter-spacing: 0.02em;
  text-transform: uppercase;

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
