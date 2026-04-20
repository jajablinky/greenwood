import styled, { css } from "styled-components"
import { Link } from "react-router-dom"
import { Menu } from "@base-ui/react/menu"

import { Avatar, AvatarFallback } from "components/atoms/Avatar"
import { Button } from "components/atoms/Button"
import { DialogContent } from "components/atoms/Dialog"

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
  /* Match feed card inner edge: same horizontal pad as FeedCard (narrow). */
  padding: 0.375rem 0.75rem;
  @media (min-width: 640px) {
    max-width: 40rem;
    /* FeedMain inline (1.5rem) + FeedCard pad-x (1rem) — aligns brand with post copy. */
    padding: 0.5rem 2.5rem;
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
  gap: 0.5rem;
`

export const HeaderTextButton = styled(Button).attrs({
  type: "button",
  variant: "ghost",
  size: "sm",
})`
  height: auto;
  min-height: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-md);
`

/** Create — hidden on narrow viewports; Connect stays visible. */
export const HeaderNewProjectButton = styled(HeaderTextButton)`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  & svg {
    width: 0.875rem;
    height: 0.875rem;
    flex-shrink: 0;
  }

  @media (max-width: 639.98px) {
    display: none;
  }
`

export const FeedMain = styled.main`
  position: relative;
  z-index: 0;
  margin-inline: auto;
  max-width: 48rem;
  padding: 0 0 4rem;
  @media (min-width: 640px) {
    max-width: 40rem;
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
  gap: 1.25rem;
  @media (min-width: 640px) {
    gap: 3.5rem;
  }
`

export const FeedItemArticle = styled.article`
  /* Align thread / composer with the main column beside the card avatar (Twitter-style). */
  --feed-avatar-size: 2.5rem;
  /* Tight space between avatar rail and preview (was 0.75rem). */
  --feed-avatar-gap: 0.5rem;
  --feed-thread-indent: calc(var(--feed-avatar-size) + var(--feed-avatar-gap));

  display: flex;
  flex-direction: column;
  gap: 0;

  @media (min-width: 640px) {
    --feed-avatar-size: 3rem;
  }
`

export const FeedCard = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-xl);
  padding: 0.75rem 1rem;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 639.98px) {
    padding: 0.75rem 0.75rem;
  }

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

/** Listing vote stack — full avatar column width so controls share the avatar’s vertical center line. */
export const FeedListingVoteCluster = styled.div`
  display: flex;
  grid-column: 1;
  grid-row: 2;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: start;
  align-self: center;
  gap: 0.25rem;
  width: var(--feed-avatar-size);
  min-width: 0;
  padding-right: 10px;
  pointer-events: auto;

  @media (min-width: 640px) {
    gap: 0.3125rem;
    padding-right: 18px;

  }
`

export const CardPreviewFrame = styled.div`
  position: relative;
  z-index: 10;
  grid-column: 2;
  grid-row: 2;
  min-width: 0;
  width: 100%;
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

/**
 * Grid: col1 = avatar + vote (same horizontal line as avatar); col2 = copy, preview, actions.
 * Vote sits in the avatar column, centered to the preview row — preview stays wider.
 */
export const CardTweetSection = styled.div`
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: var(--feed-avatar-size) minmax(0, 1fr);
  align-items: start;
  column-gap: var(--feed-avatar-gap);
  row-gap: 0.5rem;
  pointer-events: none;
`

export const FeedTweetBody = styled.div`
  display: flex;
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;
  pointer-events: auto;
`

/** Time + overflow menu; sits top-right on the app title row. */
export const FeedTweetPromptAside = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.125rem;
`

export const FeedTweetPrompt = styled.p`
  margin: 0;
  min-width: 0;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  font-weight: 400;
  color: var(--muted-foreground);
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 640px) {
    font-size: 0.875rem;
    line-height: 1.375rem;
  }
`

/** App title + optional status (leading) and time + overflow (trailing). */
export const FeedTweetAppRow = styled.div`
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`

/** Title + status pill; shares the top row with {@link FeedTweetPromptAside}. */
export const FeedTweetAppLeading = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.75rem;
`

export const FeedTweetAppName = styled.span`
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9375rem;
  line-height: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--foreground);

  @media (min-width: 640px) {
    font-size: 1rem;
    line-height: 1.45rem;
  }
`

export const FeedPostOverflowTrigger = styled(Menu.Trigger)`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin: -0.125rem -0.25rem -0.125rem 0;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  color: var(--muted-foreground);
  background: transparent;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease;

  &:hover {
    background: color-mix(in oklab, var(--foreground) 8%, transparent);
    color: var(--foreground);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
  }
`

export const FeedPostOverflowPopup = styled(Menu.Popup)`
  z-index: 60;
  min-width: 12rem;
  padding: 0.35rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--popover);
  color: var(--popover-foreground);
  box-shadow:
    0 10px 38px -10px rgb(15 23 42 / 28%),
    0 4px 16px -8px rgb(15 23 42 / 12%);

  .dark & {
    box-shadow:
      0 10px 38px -10px rgb(0 0 0 / 45%),
      0 4px 16px -8px rgb(0 0 0 / 35%);
  }
`

export const FeedPostOverflowMenuItem = styled(Menu.Item)`
  display: flex;
  cursor: pointer;
  align-items: center;
  border-radius: var(--radius-md);
  padding: 0.5rem 0.65rem;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--foreground);
  outline: none;

  &[data-highlighted] {
    background: color-mix(in oklab, var(--foreground) 8%, transparent);
  }
`

export const BuilderAvatarLink = styled(Link)`
  grid-column: 1;
  grid-row: 1;
  justify-self: start;
  line-height: 0;
  border-radius: 9999px;
  text-decoration: none;
  color: inherit;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--ring);
  }
`

export const BuilderAvatar = styled(Avatar)`
  aspect-ratio: 1;
  width: var(--feed-avatar-size);
  height: var(--feed-avatar-size);
  flex-shrink: 0;
  border-radius: 9999px;

  &::after {
    border-radius: 9999px;
  }
`

export const BuilderAvatarFallback = styled(AvatarFallback)`
  border-radius: inherit;
  font-size: 0.6875rem;
  line-height: 1rem;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: 0.8125rem;
  }
`

export const TimeMeta = styled.span`
  flex-shrink: 0;
`

export const FeedTweetTime = styled(TimeMeta)`
  color: var(--muted-foreground);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  ${tabular};

  @media (min-width: 640px) {
    font-size: 0.8125rem;
    line-height: 1.125rem;
  }
`

const feedGhostToolbarButtonCss = css`
  height: 2.25rem;
  min-height: 2.25rem;
  flex-shrink: 0;
  column-gap: 0.25rem;
  border-radius: 9999px;
  border: 0;
  padding-inline: 0.375rem;
  color: var(--muted-foreground);
  background: transparent;
  text-decoration: none;

  &:hover:not(:disabled) {
    background: color-mix(in oklab, var(--foreground) 10%, transparent) !important;
    color: var(--foreground);
  }

  .dark &:hover:not(:disabled) {
    background: color-mix(in oklab, var(--foreground) 14%, transparent) !important;
  }

  @media (min-width: 640px) {
    height: 2.5rem;
    min-height: 2.5rem;
    column-gap: 0.375rem;
    padding-inline: 0.625rem;
  }
`

export const FeedCommentLinkButton = styled(Button)`
  ${feedGhostToolbarButtonCss};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

/** Icon-only actions (copy / view app). */
export const FeedActionIconButton = styled(Button)`
  ${feedGhostToolbarButtonCss};
  display: inline-flex;
  min-width: 2.25rem;
  align-items: center;
  justify-content: center;
  padding-inline: 0.5rem;

  @media (min-width: 640px) {
    min-width: 2.5rem;
  }
`

/** Icon-only link to app detail (trailing group). */
export const FeedViewAppLinkButton = styled(FeedCommentLinkButton)`
  min-width: 2.25rem;
  padding-inline: 0.5rem;

  @media (min-width: 640px) {
    min-width: 2.5rem;
  }
`

/** Visible label next to shuffle icon in feed action bar. */
export const FeedRemixButtonText = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--muted-foreground);

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
`

export const FeedRemixToggleButton = styled(Button).withConfig({
  shouldForwardProp: (prop) => prop !== "$remixOpen",
})<{ $remixOpen?: boolean }>`
  ${feedGhostToolbarButtonCss};

  ${(p) =>
    p.$remixOpen &&
    css`
      background: color-mix(in oklab, oklch(0.65 0.15 250) 60%, transparent);
      color: var(--foreground);
      box-shadow: 0 1px 2px rgb(0 0 0 / 6%);

      ${FeedRemixButtonText} {
        color: var(--foreground);
      }

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

  &:hover:not(:disabled) ${FeedRemixButtonText} {
    color: var(--foreground);
  }
`

/**
 * Same width as the preview column: first control flush left, last flush right
 * (aligns with app view corners); remix and copy share the space between.
 */
export const CardActionBar = styled.div`
  position: relative;
  z-index: 20;
  grid-column: 2;
  grid-row: 3;
  display: flex;
  width: 100%;
  max-width: 100%;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.125rem 0 0;
  pointer-events: auto;
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

export const VoteIconBtn = styled(Button).attrs({ type: "button" })`
  display: inline-flex;
  box-sizing: border-box;
  width: 1.75rem;
  height: 1.75rem;
  min-width: 1.75rem;
  min-height: 1.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
  transition: color 150ms ease, background-color 150ms ease;

  @media (min-width: 640px) {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    min-height: 2rem;
  }
`

export const VoteArrowWrap = styled.span`
  display: inline-flex;
  width: 1.25rem;
  height: 1.25rem;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 640px) {
    width: 1.4375rem;
    height: 1.4375rem;
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

/** Vertical score between arrows in the feed listing vote column. */
export const FeedListingScoreValue = styled(ScoreValue)`
  min-width: 0;
  max-width: 100%;
  min-height: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-block: 0.125rem;

  @media (min-width: 640px) {
    min-height: 1.5rem;
  }
`

export const ThreadPanel = styled.div`
  padding: 0 0 1rem;
  padding-left: var(--feed-thread-indent);
`

export const ThreadInner = styled.div`
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  border: none;
  box-shadow: none;
  /* Solid page background — translucent + blur can read as a hairline under the header */
  background: #ffffff;
  .dark & {
    background: var(--background);
  }

  @media (max-width: 639.98px) {
    transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;

    html[data-mobile-chrome-hidden="true"] & {
      transform: translateY(-100%);
    }
  }
`
