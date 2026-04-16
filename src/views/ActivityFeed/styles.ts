import styled, { css } from "styled-components"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "components/ui/avatar"
import { Button } from "components/ui/button"
import { DialogContent } from "components/ui/dialog"

const tabular = css`
  font-variant-numeric: tabular-nums;
`

export const HeaderInner = styled.div`
  margin-inline: auto;
  display: flex;
  max-width: 48rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  @media (min-width: 640px) {
    padding-inline: 1.5rem;
  }
`

export const HeaderBrandWrap = styled.div`
  min-width: 0;
`

export const HeaderBrandLink = styled(Link)`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.025em;
  color: var(--foreground);
  text-decoration: none;
`

export const HeaderActions = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
`

export const FeedMain = styled.main`
  position: relative;
  z-index: 0;
  margin-inline: auto;
  max-width: 48rem;
  padding: 0.375rem 1rem 4rem;
  @media (min-width: 640px) {
    padding-inline: 1.5rem;
    padding-top: 0.75rem;
  }
`

export const FeedList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  @media (min-width: 640px) {
    gap: 3.5rem;
  }
`

export const FeedItemArticle = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const CardTitleText = styled.span`
  color: var(--foreground);
  text-underline-offset: 2px;
`

export const FeedCard = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: color-mix(
      in oklab,
      var(--feed-hover-accent) 5%,
      var(--card)
    );
  }

  .dark &:hover {
    background-color: color-mix(
      in oklab,
      var(--feed-hover-accent) 9%,
      var(--card)
    );
  }

  &:hover ${CardTitleText} {
    text-decoration: underline;
  }
`

export const CardOverlayLink = styled(Link)`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--radius-xl);
  text-decoration: none;

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px var(--ring),
      0 0 0 4px var(--background);
  }
`

export const CardPreviewFrame = styled.div`
  position: relative;
  z-index: 10;
  min-height: 80px;
  overflow: hidden;
  border-radius: var(--radius-xl);
  pointer-events: none;
`

export const CardPreviewIframe = styled.iframe`
  pointer-events: none;
  aspect-ratio: 16 / 9;
  display: block;
  width: 100%;
  min-height: 120px;
  border-radius: var(--radius-xl);
  border: 0;
  background: transparent;
`

export const CardMetaSection = styled.div`
  position: relative;
  z-index: 10;
  padding-block: 0.5rem;
`

export const CardMetaRow = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 0.5rem;
  @media (min-width: 640px) {
    gap: 0.75rem;
  }
`

export const CardMetaLeft = styled.div`
  pointer-events: none;
  display: flex;
  min-width: 0;
  flex: 1 1 0%;
  align-items: flex-start;
  gap: 0.5rem;
  @media (min-width: 640px) {
    gap: 0.75rem;
  }
`

export const BuilderAvatar = styled(Avatar)`
  aspect-ratio: 1;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 9999px;

  &::after {
    border-radius: 9999px;
  }

  @media (min-width: 640px) {
    width: 2.25rem;
    height: 2.25rem;
  }
`

export const BuilderAvatarFallback = styled(AvatarFallback)`
  border-radius: inherit;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
`

export const CardTextCol = styled.div`
  min-width: 0;
  flex: 1 1 0%;
`

export const CardTitleRow = styled.div`
  display: flex;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: baseline;
  column-gap: 0.5rem;
  @media (min-width: 640px) {
    column-gap: 0.625rem;
  }
`

export const CardTitleHeading = styled.h2`
  margin: 0;
  min-width: 0;
  flex-shrink: 1;
  font-size: 15px;
  line-height: 1.375;
  font-weight: 500;
  @media (min-width: 640px) {
    font-size: 1rem;
    line-height: 1.5rem;
  }
`

export const CardSubMetaRow = styled.div`
  margin-top: 0.125rem;
  display: flex;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 0.375rem;
  overflow: hidden;
  font-size: 11px;
  line-height: 1rem;
  color: var(--muted-foreground);
  @media (min-width: 640px) {
    column-gap: 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }
`

export const WalletAbbrev = styled.span`
  flex-shrink: 0;
  font-weight: 500;
  ${tabular};
  color: color-mix(in oklab, var(--foreground) 80%, transparent);
`

export const DotSep = styled.span`
  flex-shrink: 0;
`

export const TimeMeta = styled.span`
  flex-shrink: 0;
`

export const CardToolbar = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  cursor: auto;
  flex-shrink: 0;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 0.375rem;
  align-self: center;
  pointer-events: auto;
`

export const SplitButtonGroup = styled.div`
  display: flex;
  min-width: 0;
  flex-shrink: 0;
  align-items: stretch;
  overflow: hidden;
  border-radius: 9999px;
`

const feedGhostToolbarButtonCss = css`
  height: 2.25rem;
  min-height: 2.25rem;
  flex-shrink: 0;
  column-gap: 0.375rem;
  border-radius: 0;
  border: 0;
  padding-inline: 0.625rem;
  color: var(--muted-foreground);
  background: transparent;
  text-decoration: none;

  &:hover {
    background: transparent !important;
    color: var(--foreground);
  }

  .dark &:hover {
    background: transparent !important;
  }

  @media (min-width: 640px) {
    height: 2.5rem;
    min-height: 2.5rem;
  }
`

export const FeedCommentLinkButton = styled(Button)`
  ${feedGhostToolbarButtonCss};
  border-top-left-radius: 9999px;
  border-bottom-left-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

export const FeedRemixToggleButton = styled(Button).withConfig({
  shouldForwardProp: (prop) => prop !== "$remixOpen",
})<{ $remixOpen?: boolean }>`
  ${feedGhostToolbarButtonCss};
  border-top-right-radius: 9999px;
  border-bottom-right-radius: 9999px;

  ${(p) =>
    p.$remixOpen &&
    css`
      background: color-mix(in oklab, oklch(0.65 0.15 250) 60%, transparent);
      color: var(--foreground);
      box-shadow: 0 1px 2px rgb(0 0 0 / 6%);

      &:hover {
        background: color-mix(in oklab, oklch(0.65 0.15 250) 80%, transparent) !important;
      }

      .dark & {
        background: color-mix(in oklab, oklch(0.45 0.12 250) 35%, transparent);
      }

      .dark &:hover {
        background: color-mix(in oklab, oklch(0.45 0.12 250) 45%, transparent) !important;
      }
    `}
`

export const Icon16 = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export const TabularText = styled.span`
  ${tabular};
`

export const VoteGroup = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  gap: 0;
  overflow: hidden;
  border-radius: 9999px;
`

export const VoteIconBtn = styled.button<{ $active?: boolean; $tone?: "up" | "down" }>`
  display: inline-flex;
  height: 2.25rem;
  width: 1.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  padding-inline: 0;
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 150ms ease, background-color 150ms ease;

  &:hover {
    background: transparent;
    color: var(--foreground);
  }

  .dark &:hover {
    background: transparent;
  }

  ${(p) =>
    p.$active &&
    p.$tone === "up" &&
    css`
      color: var(--color-alt-green-deep);
    `}

  ${(p) =>
    p.$active &&
    p.$tone === "down" &&
    css`
      color: var(--color-alt-red-deep);
    `}

  @media (min-width: 640px) {
    height: 2.5rem;
    width: 1.75rem;
  }
`

export const VoteArrowWrap = styled.span`
  display: inline-flex;
  width: 1.5rem;
  height: 1.5rem;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 640px) {
    width: 1.75rem;
    height: 1.75rem;
  }
`

type ScoreTone = "positive" | "negative" | "neutral"

export const ScoreValue = styled.span<{ $tone: ScoreTone }>`
  min-width: 2.1rem;
  flex-shrink: 0;
  padding-inline: 0;
  text-align: center;
  font-size: 1rem;
  line-height: 1;
  font-weight: 500;
  ${tabular};

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
      color: inherit;
    `}

  @media (min-width: 640px) {
    min-width: 2.4rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
`

export const ThreadPanel = styled.div`
  padding: 0 0.75rem 0.75rem;
  @media (min-width: 640px) {
    padding-inline: 1rem;
    padding-bottom: 1rem;
  }
`

export const ThreadInner = styled.div`
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid rgb(0 0 0 / 6%);
  padding-top: 1rem;

  .dark & {
    border-color: rgb(255 255 255 / 8%);
  }
`

export const CommentList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const CommentRow = styled.li<{ $highlighted?: boolean }>`
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

export const CommentAvatar = styled(Avatar)`
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: var(--radius-md);
`

export const CommentAvatarFallback = styled(AvatarFallback)`
  border-radius: var(--radius-md);
  font-size: 10px;
`

export const CommentBodyCol = styled.div`
  min-width: 0;
  flex: 1 1 0%;
`

export const CommentHeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }
`

export const CommentAuthorRow = styled.div`
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 0.5rem;
  row-gap: 0.125rem;
  font-size: 0.75rem;
  line-height: 1rem;
`

export const CommentAuthorName = styled.span`
  font-weight: 500;
  color: var(--foreground);
`

export const CommentTime = styled.span`
  color: var(--muted-foreground);
`

type VoteMarkTone = "up" | "down" | "neutral"

export const CommentVoteMark = styled.span<{ $tone: VoteMarkTone }>`
  flex-shrink: 0;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  ${tabular};

  @media (min-width: 640px) {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  ${(p) =>
    p.$tone === "up" &&
    css`
      color: var(--color-alt-green-deep);
    `}
  ${(p) =>
    p.$tone === "down" &&
    css`
      color: var(--color-alt-red-deep);
    `}
  ${(p) =>
    p.$tone === "neutral" &&
    css`
      color: var(--muted-foreground);
    `}
`

export const CommentBodyText = styled.p`
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  line-height: 1.625;
  color: color-mix(in oklab, var(--foreground) 90%, transparent);
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

export const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
  }
`

export const CommentTextarea = styled.textarea`
  min-height: 72px;
  width: 100%;
  flex: 1 1 0%;
  resize: vertical;
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

export const CommentSubmitButton = styled(Button)`
  flex-shrink: 0;
  @media (min-width: 640px) {
    margin-bottom: 0.125rem;
  }
`

export const RemixDialogContent = styled(DialogContent)`
  display: flex;
  max-height: min(85vh, 36rem);
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
  padding: 1.25rem;

  @media (min-width: 640px) {
    max-width: 32rem;
  }
`

export const DialogTitleAccent = styled.span`
  font-weight: 500;
  color: var(--foreground);
`

export const RemixDialogList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: min(38vh, 18rem);
  min-height: 0;
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 0.125rem;
`

export const RemixDialogRowLink = styled(Link)`
  display: flex;
  gap: 0.75rem;
  border-radius: var(--radius-xl);
  border: 1px solid rgb(0 0 0 / 8%);
  background: color-mix(in oklab, var(--muted) 25%, transparent);
  padding: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: background-color 150ms ease;

  &:hover {
    background: color-mix(in oklab, var(--muted) 45%, transparent);
  }

  .dark & {
    border-color: rgb(255 255 255 / 10%);
  }

  .dark &:hover {
    background: color-mix(in oklab, var(--muted) 20%, transparent);
  }
`

export const RemixDialogAvatar = styled(Avatar)`
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
`

export const RemixDialogAvatarFallback = styled(AvatarFallback)`
  border-radius: var(--radius-lg);
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
`

export const RemixDialogRowBody = styled.div`
  min-width: 0;
  flex: 1 1 0%;
`

export const RemixDialogRowTitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375;
  color: var(--foreground);
`

export const RemixDialogRowMeta = styled.p`
  margin: 0.125rem 0 0;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--muted-foreground);
`

export const RemixDialogAuthor = styled.span`
  font-weight: 500;
  color: color-mix(in oklab, var(--foreground) 80%, transparent);
`

export const RemixDialogVotes = styled.p`
  margin: 0.125rem 0 0;
  font-size: 0.75rem;
  line-height: 1rem;
  ${tabular};
  color: var(--muted-foreground);
`

export const RemixComposerSection = styled.div`
  flex-shrink: 0;
  border-top: 1px solid rgb(0 0 0 / 6%);
  padding-top: 1rem;

  .dark & {
    border-color: rgb(255 255 255 / 8%);
  }
`

export const RemixContextChip = styled.div`
  margin-bottom: 0.5rem;
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 0.375rem;
  border-radius: var(--radius-md);
  background: color-mix(in oklab, oklch(0.75 0.12 230) 50%, transparent);
  padding: 0.25rem 0.5rem;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.375;
  color: oklch(0.25 0.08 230);

  .dark & {
    background: color-mix(in oklab, oklch(0.35 0.08 230) 50%, transparent);
    color: oklch(0.95 0.04 230);
  }
`

export const RemixContextIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  opacity: 0.85;
  color: oklch(0.45 0.12 230);

  .dark & {
    color: oklch(0.78 0.1 230);
  }

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export const RemixContextName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RemixComposerRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`

export const RemixComposerTextarea = styled.textarea`
  max-height: 7rem;
  min-height: 44px;
  flex: 1 1 0%;
  resize: none;
  border-radius: var(--radius-lg);
  border: 0;
  background: rgb(0 0 0 / 3%);
  padding: 0.5rem 0.625rem;
  font-size: 13px;
  line-height: 1.375;
  color: var(--foreground);
  outline: none;
  box-shadow: none;

  &::placeholder {
    color: color-mix(in oklab, var(--muted-foreground) 80%, transparent);
  }

  &:focus-visible {
    background: rgb(0 0 0 / 4%);
  }

  .dark & {
    background: rgb(255 255 255 / 6%);
  }

  .dark &:focus-visible {
    background: rgb(255 255 255 / 8%);
  }
`

export const RemixSendIconButton = styled(Button)`
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background: var(--muted);
  color: var(--muted-foreground);

  & svg {
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    background: color-mix(in oklab, var(--muted-foreground) 25%, transparent);
    color: var(--background);
  }

  .dark &:hover {
    background: color-mix(in oklab, var(--muted-foreground) 35%, transparent);
  }
`

export const Page = styled.div`
  min-height: 100svh;
  background: #ffffff;
  color: var(--foreground);
  .dark & {
    background: var(--background);
  }
`

export const StickyHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid rgb(0 0 0 / 6%);
  background: color-mix(in oklab, white 92%, transparent);
  backdrop-filter: blur(12px);
  .dark & {
    border-color: rgb(255 255 255 / 8%);
    background: color-mix(in oklab, var(--background) 92%, transparent);
  }
`
