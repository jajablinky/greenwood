import styled from "styled-components"

/** Collapsed iframe — detail page (hero preview). */
export const DetailCollapsedIframe = styled.iframe`
  aspect-ratio: 16 / 9;
  display: block;
  width: 100%;
  border-radius: var(--radius-xl);
  border: 0;
  background: transparent;
  pointer-events: none;
`

/** Create dialog: fills the bordered remix preview frame. */
export const DialogCollapsedIframe = styled.iframe`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: inherit;
  background: transparent;
  pointer-events: none;
`

/** Fills remix preview frame (parent must be `position: relative`). */
export const CollapsedHitAreaDialog = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  cursor: zoom-in;

  &:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
`

export const CollapsedHitArea = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  cursor: zoom-in;
  width: 100%;

  &:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
`

/** Icon-only affordance (expand) — no label text. */
export const CollapsedHint = styled.span`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  color: oklch(0.98 0 0);
  background: oklch(0.2 0 0 / 72%);
  backdrop-filter: blur(8px);
  pointer-events: none;
  box-shadow: 0 1px 4px oklch(0 0 0 / 25%);

  & > svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .dark & {
    background: oklch(0.15 0 0 / 78%);
    color: oklch(0.96 0 0);
  }
`

export const PhoneSrcDocIframe = styled.iframe`
  display: block;
  flex: 1;
  min-height: 0;
  width: 100%;
  border: 0;
  background: var(--background);
`

export const ExpandOverlayRoot = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100dvh;
  background: oklch(0.18 0 0 / 96%);
  overflow: auto;
  padding: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0)
    env(safe-area-inset-bottom, 0) env(safe-area-inset-left, 0);

  .dark & {
    background: oklch(0.12 0 0 / 97%);
  }
`

export const ShrinkBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 1rem 0.5rem;
`

export const ShrinkButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border-radius: 9999px;
  border: 1px solid oklch(1 0 0 / 14%);
  background: oklch(0.28 0 0 / 92%);
  color: oklch(0.96 0 0);
  cursor: pointer;
  box-shadow: 0 0.35rem 1rem oklch(0 0 0 / 35%);

  & > svg {
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
  }

  &:hover {
    background: oklch(0.34 0 0 / 94%);
  }

  &:focus-visible {
    outline: 2px solid oklch(0.72 0 0);
    outline-offset: 2px;
  }
`

export const PhoneStage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem 1.25rem;
  min-height: 0;
`
