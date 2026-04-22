import styled, { css } from "styled-components"
import { Link } from "react-router-dom"
import { Menu } from "@base-ui/react/menu"

import { Avatar, AvatarFallback } from "components/atoms/Avatar"
import { Button } from "components/atoms/Button"
import { ConnectWalletButton } from "components/molecules/ConnectWalletButton"

const tabular = css`
  font-variant-numeric: tabular-nums;
`

export const HeaderInner = styled.div`
  box-sizing: border-box;
  margin-inline: auto;
  display: flex;
  width: 100%;
  max-width: 48rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  /* Align with feed card inner edge (avatar column): matches --feed-card-padding-x. */
  padding: 0.375rem 0.25rem;
  @media (min-width: 640px) {
    max-width: 40rem;
    /* Same inset as feed cards: FeedMain 0.75rem + FeedCard 0.5rem (see FeedItemArticle). */
    padding: 0.5rem 1.25rem;
  }
`

export const HeaderBrandWrap = styled.div`
  flex-shrink: 0;
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

/** Desktop: floating Create button — hidden on mobile, where the tab bar + handles it. */
export const FeedCreateFab = styled(Button)`
  display: none;

  @media (min-width: 640px) {
    display: inline-flex;
    position: fixed;
    right: 1.25rem;
    bottom: 1.25rem;
    z-index: 45;
  }
`

/** Same ghost treatment + metrics as header text buttons (no wallet pill). */
export const HeaderConnectWalletButton = styled(ConnectWalletButton).attrs({
  feedHeader: true,
})`
  && {
    height: auto;
    min-height: 0;
    flex-shrink: 0;
    padding: 0.375rem 0.625rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    border-radius: var(--radius-md);
  }
`

/** Connected wallet — circular avatar; links to profile (disconnect from profile wallet control). */
export const HeaderWalletAvatarLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 9999px;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    opacity: 0.92;
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
  }
`

export const HeaderWalletAvatar = styled(Avatar).attrs({ size: "default" })`
  flex-shrink: 0;
  border-radius: 50%;

  &::after {
    border-width: 2.5px;
    border-style: solid;
    border-color: #0a0a0a;
    mix-blend-mode: normal;
  }

  .dark &::after {
    border-color: rgba(250, 250, 250, 0.94);
  }
`

export const HeaderWalletAvatarFallback = styled(AvatarFallback)``

export const FeedMain = styled.main`
  position: relative;
  z-index: 0;
  margin-inline: auto;
  max-width: 48rem;
  padding: 0.75rem 0 4rem;

  @media (max-width: 639.98px) {
    padding-bottom: 4rem;
  }

  @media (min-width: 640px) {
    max-width: 40rem;
    /* Tighter than 1.5rem so the feed column lines up with the app preview edge. */
    padding: 1rem 0.75rem 4rem;
  }
`

/** Inline thread composer — hidden on mobile (use app detail to comment). */
export const FeedInlineComposerDesktopOnly = styled.div`
  @media (max-width: 639.98px) {
    display: none;
  }
`

export const FeedList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const FeedItemArticle = styled.article`
  /* Tight to one title line; prompt sits on the next grid row, not beside the avatar. */
  --feed-avatar-size: 1.75rem;
  /* Horizontal space between avatar and title row (keep tight; thread indent uses this). */
  --feed-avatar-gap: 0.25rem;
  --feed-thread-indent: calc(var(--feed-avatar-size) + var(--feed-avatar-gap));
  /* Inner card gutter — kept tight so the avatar sits near the viewport edge on mobile. */
  --feed-card-padding-x: 0.25rem;

  display: flex;
  flex-direction: column;
  gap: 0;

  @media (max-width: 639.98px) {
    --feed-avatar-gap: 0.15rem;
  }

  @media (min-width: 640px) {
    --feed-avatar-size: 2rem;
    --feed-card-padding-x: 0.5rem;
  }
`

/**
 * Wraps the feed card + comment thread so hover tint applies to the full listing
 * (preview, actions, and comments) instead of only the card chrome.
 */
export const FeedListingSurface = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 0;
  /* One rule per listing — separates modules; FeedList has no gap so the rule sits flush between items. */
  border-bottom: 1px solid color-mix(in oklab, var(--border) 50%, transparent);
  /* Air below the previous item’s divider (first row has no line above). */
  padding-top: 0.875rem;

  li:first-child & {
    padding-top: 0;
  }

  @media (min-width: 640px) {
    padding-top: 1rem;
  }

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
`

export const FeedCard = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0;
  padding: 0.75rem var(--feed-card-padding-x, var(--content-padding-x));
`

export const CardOverlayLink = styled(Link)`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 0;
  text-decoration: none;

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px var(--ring),
      0 0 0 4px var(--background);
  }
`

/** Vote cluster — horizontal `↑ score ↓` (footer row, right-aligned). */
export const FeedVoteCluster = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.125rem;
  pointer-events: auto;

  @media (min-width: 640px) {
    gap: 0.25rem;
  }
`

/** Comment · remix · view app — action bar, left (below the preview). */
export const FeedSocialActionCluster = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.125rem;
  pointer-events: auto;

  @media (min-width: 640px) {
    gap: 0.25rem;
  }
`

/* Spans the full grid row (col 1 → col end) so the preview drops the avatar-
   column indent and fills the card's content area on every viewport. */
export const CardPreviewFrame = styled.div`
  position: relative;
  z-index: 10;
  grid-column: 1 / -1;
  grid-row: 3;
  min-width: 0;
  width: 100%;
  min-height: 80px;
  overflow: hidden;
  border-radius: var(--radius-xl);
  /* Extra air between subtitle row and the embed; row-gap alone is quite tight. */
  margin-top: 0.2rem;
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
 * Grid: row1 = avatar | title line; row2 = prompt (col2 only). Preview + bar follow.
 */
export const CardTweetSection = styled.div`
  position: relative;
  z-index: 10;
  grid-template-columns: var(--feed-avatar-size) minmax(0, 1fr);
  align-items: start;
  /* Tight title→subtitle; preview/action rows rely on the same value + padding on iframe bar. */
  pointer-events: none;
`

export const FeedTweetBody = styled.div`
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  pointer-events: auto;
`

/** Inline `· {time}` pair that sits next to the title. `display: inline-flex`
    with `nowrap` keeps the separator glued to the time when the title wraps. */
export const FeedTweetTimeInline = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: baseline;
  gap: 0.25rem;
  white-space: nowrap;
`

export const FeedTweetTimeSep = styled.span`
  color: var(--muted-foreground);
  font-size: 0.75rem;
  line-height: 1;
`

export const FeedTweetPrompt = styled.p`
  display: none;
  grid-column: 2;
  grid-row: 2;
  margin: 0;
  min-width: 0;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  font-weight: 400;
  color: var(--muted-foreground);
  overflow-wrap: anywhere;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  pointer-events: auto;

  @media (max-width: 639.98px) {
    font-size: 0.75rem;
    line-height: 1.2rem;
  }

  @media (min-width: 640px) {
    font-size: 0.875rem;
    line-height: 1.375rem;
  }
`

/** App title + status + time (leading) and absolutely positioned overflow (top right). */
export const FeedTweetAppRow = styled.div`
  position: relative;
  display: flex;
  min-width: 0;
  /* flex-start: title, time, and overflow share the same top edge as the
     avatar. (center would vertically center a one-line title in the 2rem menu.) */
  align-items: flex-start;
  gap: 0.5rem;
`

/** Title + status pill + inline time; shares the top row with the vote cluster.
    `flex: 0 1 auto` on the name keeps the time glued to the end of the title
    instead of stretching across the available space. */
export const FeedTweetAppLeading = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.35rem;
  /* Room for the absolute ⋮ (2rem) */
  padding-right: 2.25rem;
`

export const FeedTweetAppName = styled.span`
  min-width: 0;
  flex: 0 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9375rem;
  line-height: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--foreground);

  @media (max-width: 639.98px) {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

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
  margin: 0;
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
  gap: 0.5rem;
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

export const FeedPostOverflowMenuItemIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  color: var(--muted-foreground);

  & > svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export const BuilderAvatarLink = styled(Link)`
  grid-column: 1;
  grid-row: 1;
  align-self: center;
  justify-self: start;
  line-height: 0;
  border-radius: 9999px;
  text-decoration: none;
  color: inherit;
  outline: none;
  /* Re-enable events so the avatar opens the profile (and fires the hover
     preview) instead of the underlying card overlay link. */
  pointer-events: auto;
  cursor: pointer;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--ring);
  }
`

export const BuilderAvatar = styled(Avatar)`
  && {
    aspect-ratio: 1;
    width: var(--feed-avatar-size);
    height: var(--feed-avatar-size);
    flex-shrink: 0;
    border-radius: 9999px;
  }

  &::after {
    border-radius: 9999px;
  }
`

export const BuilderAvatarFallback = styled(AvatarFallback)`
  border-radius: inherit;
  font-size: 0.625rem;
  line-height: 1;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: 0.6875rem;
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

  @media (max-width: 639.98px) {
    font-size: 0.6875rem;
    line-height: 0.9375rem;
  }

  @media (min-width: 640px) {
    font-size: 0.8125rem;
    line-height: 1.125rem;
  }
`

const feedGhostToolbarButtonCss = css`
  height: 2rem;
  min-height: 2rem;
  flex-shrink: 0;
  column-gap: 0.25rem;
  border-radius: 9999px;
  border: 0;
  padding-inline: 0.3125rem;
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
    height: 2.125rem;
    min-height: 2.125rem;
    column-gap: 0.3125rem;
    padding-inline: 0.5rem;
  }
`

export const FeedCommentLinkButton = styled(Button)`
  ${feedGhostToolbarButtonCss};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Icon + count: a bit more air than base ghost column-gap */
  column-gap: 0.375rem;

  @media (min-width: 640px) {
    column-gap: 0.5rem;
  }
`

const feedIconOnlySquareCss = css`
  /* Override Button size="sm" padding and line-height so SVGs optically center */
  && {
    box-sizing: border-box;
    padding: 0 !important;
    line-height: 0;
  }

  width: 2rem;
  min-width: 2rem;
  max-width: 2rem;
  height: 2rem;

  @media (min-width: 640px) {
    width: 2.125rem;
    min-width: 2.125rem;
    max-width: 2.125rem;
    height: 2.125rem;
  }
`

/** Icon-only link to app detail. */
export const FeedViewAppLinkButton = styled(FeedCommentLinkButton)`
  ${feedIconOnlySquareCss};
`

/**
 * Footer row: social actions (left) and vote cluster (right). Overflow ⋮ is in
 * the header row (top right).
 */
export const CardActionBar = styled.div`
  position: relative;
  z-index: 20;
  grid-column: 1 / -1;
  grid-row: 4;
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

export const CardActionBarOverflow = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  pointer-events: auto;
`

/** Toolbar glyph slot — matches Button’s default `svg { 1rem }` so icons stay centered. */
export const Icon16 = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  line-height: 0;

  & > svg {
    display: block;
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

  @media (max-width: 639.98px) {
    min-width: 1.75rem;
    font-size: 0.875rem;
  }

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
  /* Line up with CardTweetSection column 2: card inset + avatar column + gap */
  padding: 0 var(--feed-card-padding-x) 1rem;
`

export const ThreadInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  /* Approx height of the brand row (padding 0.375 + 0.375 + line-height 1.25) — used to
     slide just the brand off on mobile while the sort row stays pinned to the top. */
  --feed-header-brand-height: 2rem;

  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  border-bottom: none;
  box-shadow: none;
  /* Solid page background — keeps the sort row legible while sticky. */
  background: #ffffff;
  .dark & {
    background: var(--background);
  }

  @media (min-width: 640px) {
    --feed-header-brand-height: 2.25rem;
  }

  @media (max-width: 639.98px) {
    transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;

    html[data-mobile-chrome-hidden="true"] & {
      /* Hide only the brand row — keep Popular/New pinned to the top on scroll. */
      transform: translateY(calc(-1 * var(--feed-header-brand-height)));
    }
  }
`

/** Sort controls — minimal text tabs; horizontal inset matches the feed avatar column. */
export const FeedSortBar = styled.div`
  box-sizing: border-box;
  margin-inline: auto;
  display: flex;
  width: 100%;
  max-width: 48rem;
  gap: 1.25rem;
  padding: 0.2rem 0.25rem 0;
  border-bottom: 1px solid color-mix(in oklab, var(--border) 40%, transparent);

  @media (min-width: 640px) {
    max-width: 40rem;
    padding: 0.25rem 1.25rem 0;
  }
`

export const FeedSortPill = styled.button<{ $active: boolean }>`
  box-sizing: border-box;
  flex: 1 1 0;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0;
  border: none;
  border-radius: 0;
  border-bottom: 2px solid
    ${(p) => (p.$active ? "var(--foreground)" : "transparent")};
  background: transparent;
  color: ${(p) => (p.$active ? "var(--foreground)" : "var(--muted-foreground)")};
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  letter-spacing: -0.02em;
  cursor: pointer;
  transition:
    color 120ms ease,
    border-color 120ms ease;

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }

  &:hover {
    color: var(--foreground);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
    border-radius: 2px;
  }
`
