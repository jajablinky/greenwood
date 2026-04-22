import styled, { css, keyframes } from "styled-components"

/** Inline wrapper around the trigger. `display: contents` keeps layout unchanged. */
export const HoverTriggerWrap = styled.span`
  display: contents;
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const HoverCard = styled.div<{
  $top: number
  $left: number
  $ready: boolean
}>`
  position: fixed;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  z-index: 1000;
  width: 20rem;
  max-width: calc(100vw - 1rem);
  padding: 0.85rem 0.95rem 0.9rem;
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
  background: var(--card);
  color: var(--foreground);
  box-shadow:
    0 8px 24px color-mix(in oklab, #000 18%, transparent),
    0 1px 2px color-mix(in oklab, #000 6%, transparent);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;

  ${(p) =>
    p.$ready
      ? css`
          animation: ${fadeIn} 120ms ease-out both;
        `
      : css`
          opacity: 0;
        `}

  .dark & {
    background: color-mix(in oklab, var(--card) 96%, #000 4%);
    box-shadow:
      0 10px 30px color-mix(in oklab, #000 55%, transparent),
      0 1px 2px color-mix(in oklab, #000 30%, transparent);
  }
`

/**
 * Transparent anchor that covers the entire card. Clicks on any "dead space"
 * (avatar, bio, follower counts) navigate to the profile. Interactive zones
 * (Follow button, name, handle) sit above it via `z-index: 2`.
 */
export const HoverOverlayLink = styled.a`
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  text-decoration: none;
  color: transparent;
  cursor: pointer;
`

export const HoverTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`

/** Wraps the Follow button so it sits above `HoverOverlayLink` and captures
    its own clicks (without bubbling up to the overlay's navigation). */
export const HoverFollowSlot = styled.span`
  position: relative;
  z-index: 2;
`

export const HoverAvatar = styled.div<{ $hue: number }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
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
`

export const HoverIdentity = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  min-width: 0;
`

export const HoverNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
`

export const HoverName = styled.a`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--foreground);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`

export const HoverVerifiedDot = styled.span`
  flex-shrink: 0;
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: oklch(0.68 0.17 245);
`

export const HoverHandle = styled.a`
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  text-decoration: none;
  line-height: 1.15;

  &:hover {
    text-decoration: underline;
  }
`

export const HoverBio = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--foreground);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

/** Following · Followers row, à la Twitter. */
export const HoverFollowRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
`

export const HoverFollowItem = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
  color: var(--muted-foreground);
`

export const HoverFollowValue = styled.span`
  color: var(--foreground);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

