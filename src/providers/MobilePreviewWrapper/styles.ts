import styled, { css } from "styled-components"

/** Logical device (iPhone 14 class) — inner scroll viewport */
export const DEVICE_WIDTH_PX = 390
export const DEVICE_HEIGHT_PX = 844

export const Outer = styled.div<{ $preview: boolean }>`
  width: 100%;
  min-height: 100svh;

  ${(p) =>
    p.$preview
      ? css`
          position: fixed;
          inset: 0;
          z-index: 9990;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          min-height: 100dvh;
          background: oklch(0.22 0 0);
          overflow: auto;
        `
      : css`
          position: relative;
        `}
`

export const Scaler = styled.div<{ $preview: boolean }>`
  flex-shrink: 0;
  width: 100%;

  ${(p) =>
    p.$preview
      ? css`
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center center;
          transform: scale(
            min(1, min(calc((100vw - 3rem) / 430px), calc((100dvh - 3rem) / 880px)))
          );
        `
      : css`
          transform: none;
        `}
`

export const PhoneShell = styled.div<{ $preview: boolean }>`
  ${(p) =>
    p.$preview
      ? css`
          width: ${DEVICE_WIDTH_PX + 24}px;
          max-width: calc(100vw - 3rem);
          padding: 0.35rem 0.75rem 0.75rem;
          border-radius: 2.75rem;
          background: linear-gradient(
            165deg,
            oklch(0.28 0 0) 0%,
            oklch(0.14 0 0) 45%,
            oklch(0.12 0 0) 100%
          );
          box-shadow:
            0 0 0 1px oklch(1 0 0 / 8%),
            0 2.5rem 5rem oklch(0 0 0 / 55%),
            inset 0 1px 0 oklch(1 0 0 / 10%);
        `
      : css`
          width: 100%;
          padding: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        `}
`

export const PhoneSpeaker = styled.div<{ $preview: boolean }>`
  ${(p) =>
    p.$preview
      ? css`
          display: block;
          height: 0.3125rem;
          margin: 0.125rem auto 0.375rem;
          width: 2.75rem;
          border-radius: 9999px;
          background: oklch(0 0 0 / 55%);
          box-shadow: inset 0 1px 1px oklch(0 0 0 / 45%);
        `
      : css`
          display: none;
        `}
`

export const PhoneScreen = styled.div<{ $preview: boolean }>`
  ${(p) =>
    p.$preview
      ? css`
          display: flex;
          flex-direction: column;
          width: ${DEVICE_WIDTH_PX}px;
          max-width: 100%;
          height: ${DEVICE_HEIGHT_PX}px;
          border-radius: 2.25rem;
          overflow: hidden;
          background: oklch(0.08 0 0);
          box-shadow:
            inset 0 0 0 1px oklch(0 0 0 / 35%),
            0 0 0 1px oklch(1 0 0 / 6%);
        `
      : css`
          width: 100%;
          min-height: 100svh;
          border-radius: 0;
          overflow: visible;
          background: transparent;
          box-shadow: none;
        `}
`

export const ScreenInner = styled.div<{ $preview: boolean }>`
  width: 100%;

  ${(p) =>
    p.$preview
      ? css`
          flex: 1;
          min-height: 0;
          overflow: auto;
          overflow-x: hidden;
          background: var(--background);
          -webkit-overflow-scrolling: touch;
        `
      : css`
          min-height: 100svh;
          overflow: visible;
          background: transparent;
        `}
`

/** Status bar + iframe / content stack inside the rounded screen. */
export const ScreenStack = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

/** iOS-like placeholder row (outside iframe so it does not affect MQ width). */
export const IosStatusBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 1rem 0.375rem;
  background: var(--background);
  color: var(--foreground);
  border-bottom: 1px solid color-mix(in oklab, var(--foreground) 8%, transparent);
`

export const IosStatusTime = styled.span`
  font-family: ui-rounded, system-ui, -apple-system, "SF Pro Text", sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
`

export const IosStatusIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  color: var(--foreground);

  svg {
    flex-shrink: 0;
  }
`

/** Fills remaining screen height; document uses frame width for MQ. */
export const PreviewIframe = styled.iframe`
  display: block;
  flex: 1;
  min-height: 0;
  width: 100%;
  border: 0;
  background: var(--background);
`

export const ToggleButton = styled.button`
  position: fixed;
  bottom: 1.25rem;
  left: 1.25rem;
  z-index: 10001;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid oklch(1 0 0 / 12%);
  background: oklch(0.22 0 0 / 92%);
  color: oklch(0.96 0 0);
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  box-shadow: 0 0.5rem 1.5rem oklch(0 0 0 / 35%);
  backdrop-filter: blur(10px);

  &:hover {
    background: oklch(0.28 0 0 / 94%);
  }

  &:focus-visible {
    outline: 2px solid oklch(0.72 0 0);
    outline-offset: 2px;
  }
`
