import styled, { css } from "styled-components"
import { Link } from "react-router-dom"

export const ProfileStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  /* Match the feed's main-column gutter via the shared --content-padding-x token. */
  padding-inline: var(--content-padding-x);
  /* Compact avatar sits inline with the display name; everything else aligns to the left edge. */
  --profile-avatar-size: 2.75rem;
  --profile-avatar-col-gap: 0.65rem;
  --profile-text-inset: 0px;

  @media (min-width: 640px) {
    --profile-avatar-size: 3rem;
  }
`

/** Hero surface: modeled after `ProfileHoverCard` — gradient avatar on the
    top-left, Follow/Share on the top-right, identity block beneath. No banner;
    transparent background keeps the page minimal. */
export const ProfileHeroCard = styled.section`
  position: relative;
  border-radius: var(--radius-lg);
  background: transparent;
`

/** Grid: avatar sits inline with the name (row 1 only); identity block spans the
    full width underneath so handle/bio/stats start at the left edge. */
export const ProfileHeroBody = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: var(--profile-avatar-size) minmax(0, 1fr);
  grid-template-areas:
    "avatar head"
    "ident  ident";
  column-gap: var(--profile-avatar-col-gap);
  row-gap: 0.45rem;
  align-items: center;
  padding: 0.5rem 0 0.75rem;
`

/** Name + verified (left) and Follow/Share (right) — col 2, row 1. */
export const ProfileHeroHeadline = styled.div`
  grid-area: head;
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`

/** Gradient avatar — same tint recipe as `ProfileHoverCard`'s `HoverAvatar`,
    just sized up for the main profile surface. */
export const ProfileAvatar = styled.div<{ $hue: number }>`
  grid-area: avatar;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--profile-avatar-size);
  height: var(--profile-avatar-size);
  border-radius: 50%;
  border: 2px solid color-mix(in oklab, var(--background) 80%, transparent);
  color: var(--foreground);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  ${(p) => css`
    background: linear-gradient(
      135deg,
      oklch(0.9 0.07 ${p.$hue}),
      oklch(0.8 0.09 ${(p.$hue + 45) % 360})
    );
    .dark & {
      background: linear-gradient(
        135deg,
        oklch(0.44 0.08 ${p.$hue}),
        oklch(0.3 0.07 ${(p.$hue + 45) % 360})
      );
    }
  `}

  @media (min-width: 640px) {
    font-size: 0.9375rem;
  }
`

export const ProfileIdentity = styled.div`
  grid-area: ident;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

export const ProfileNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
  flex: 1 1 auto;
`

export const ProfileName = styled.h1`
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.25;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }
`

/** Blue verified dot shown for known/curated builders. */
export const VerifiedDot = styled.span`
  flex-shrink: 0;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: oklch(0.68 0.17 245);
  box-shadow: 0 0 0 1px color-mix(in oklab, var(--background) 60%, transparent);
`

export const ProfileHandle = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.2;
  color: var(--muted-foreground);
`

export const ProfileWalletChip = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.15rem;
  padding: 0.2rem 0.55rem;
  border: 0;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--foreground) 6%, transparent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: var(--foreground);
  cursor: pointer;
  transition: background-color 120ms ease;

  &:hover {
    background: color-mix(in oklab, var(--foreground) 10%, transparent);
  }

  & > svg {
    opacity: 0.6;
  }
`

export const ProfileBio = styled.p`
  margin: 0.3rem 0 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--foreground);
  max-width: 40rem;
`

export const ProfileMetaRow = styled.p`
  margin: 0.1rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
`

/** Following · Followers — inline, Twitter-style, bold values with muted labels. */
export const ProfileFollowRow = styled.p`
  margin: 0.3rem 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.3rem 1rem;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
`

export const ProfileFollowItem = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
  color: var(--muted-foreground);
`

export const ProfileFollowValue = styled.span`
  color: var(--foreground);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

/** Right-aligned trailing slot in `ProfileFollowRow`, e.g. "Joined Nov 2025". */
export const ProfileJoinedItem = styled.span`
  margin-left: auto;
  color: var(--muted-foreground);
`

export const ProfileActions = styled.div`
  flex-shrink: 0;
  display: flex;
  gap: 0.4rem;
  align-items: center;
`

/** Underline tab bar — horizontally scrollable on mobile. */
export const TabNav = styled.nav`
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  border-bottom: 1px solid color-mix(in oklab, var(--border) 60%, transparent);
  /* Match graph title: tab label text aligns with first character of h2. */
  padding-left: max(0px, calc(var(--profile-text-inset) - 0.3rem));

  &::-webkit-scrollbar {
    display: none;
  }
`

export const TabButton = styled.button<{ $active: boolean }>`
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.3rem;
  margin-bottom: -1px;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 120ms ease;

  ${(p) =>
    p.$active &&
    css`
      color: var(--foreground);
      border-bottom-color: var(--foreground);
    `}

  &:hover {
    color: var(--foreground);
  }
`

export const TabCount = styled.span`
  display: inline-flex;
  min-width: 1.25rem;
  padding: 0 0.3rem;
  justify-content: center;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--muted) 60%, transparent);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--muted-foreground);
  font-variant-numeric: tabular-nums;
`

/** Segmented sub-filter inside a tab panel — `All · Apps · Remixes`, etc. */
export const SubFilterBar = styled.div`
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  margin: 0.1rem 0 0.15rem;
  /* First pill’s label lines up with profile text / graph title. */
  padding-left: max(0px, calc(var(--profile-text-inset) - 0.7rem));

  &::-webkit-scrollbar {
    display: none;
  }
`

export const SubFilterPill = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 1.75rem;
  padding: 0 0.7rem;
  border-radius: 9999px;
  border: 1px solid
    ${(p) =>
      p.$active
        ? "transparent"
        : "color-mix(in oklab, var(--border) 70%, transparent)"};
  background: ${(p) =>
    p.$active ? "var(--foreground)" : "transparent"};
  color: ${(p) => (p.$active ? "var(--background)" : "var(--muted-foreground)")};
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease,
    border-color 120ms ease;

  &:hover {
    ${(p) =>
      !p.$active &&
      css`
        background: color-mix(in oklab, var(--foreground) 5%, transparent);
        color: var(--foreground);
      `}
  }
`

export const SubFilterCount = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
`

/** Up/down arrow badge in the trailing slot for vote rows. */
export const VoteArrowBadge = styled.span<{ $dir: "up" | "down" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: ${(p) =>
    p.$dir === "up" ? "oklch(0.62 0.18 150)" : "oklch(0.62 0.2 25)"};

  & svg {
    width: 0.85rem;
    height: 0.85rem;
  }
`

/** Item list for tab panels — rows with thumb, title/meta, trailing meta. */
export const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

export const ItemRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.65rem;
  /* Title text lines up with graph / tabs; thumb sits in the avatar column band. */
  padding-left: max(0.5rem, calc(var(--profile-text-inset) - 2.5rem - 0.75rem));
  border-radius: var(--radius-md);
  color: var(--foreground);
  text-decoration: none;
  transition: background-color 120ms ease;

  &:hover {
    background: color-mix(in oklab, var(--foreground) 4%, transparent);
  }
`

/** Gradient thumbnail tile — keyed to the feed item's `previewHoverAccent`. */
export const ItemThumb = styled.span`
  flex-shrink: 0;
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.4rem;
  background: oklch(0.9 0.04 80);
  border: 1px solid color-mix(in oklab, var(--border) 40%, transparent);
`

export const ItemBody = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`

export const ItemTitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemMeta = styled.p`
  margin: 0.1rem 0 0;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemExcerpt = styled.p`
  margin: 0.1rem 0 0;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemTrailing = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  font-variant-numeric: tabular-nums;
`

export const EmptyPanel = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--muted-foreground);
  border: 1px dashed color-mix(in oklab, var(--border) 55%, transparent);
  border-radius: var(--radius-md);
`
