import { NavLink } from "react-router-dom"
import styled, { css } from "styled-components"

const mobileTabBarReserve = css`
  padding-bottom: calc(3.5rem + env(safe-area-inset-bottom, 0px));
  transition: padding-bottom 0.22s cubic-bezier(0.4, 0, 0.2, 1);

  html[data-mobile-chrome-hidden="true"] & {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
`

/** Space reserved under scrollable content so the fixed tab bar does not cover it. */
export const MobileAppShellBody = styled.div`
  min-height: 100dvh;

  @media (max-width: 639.98px) {
    ${mobileTabBarReserve}
  }
`

export const Bar = styled.nav`
  display: none;

  @media (max-width: 639.98px) {
    display: flex;
    position: fixed;
    z-index: 40;
    inset-inline: 0;
    bottom: 0;
    box-sizing: border-box;
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
    justify-content: space-around;
    align-items: flex-start;
    gap: 0;
    border-top: 0.33px solid color-mix(in oklab, var(--foreground) 12%, transparent);
    background: color-mix(in oklab, var(--card) 96%, transparent);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    font-family:
      -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui,
      sans-serif;
    -webkit-tap-highlight-color: transparent;
    padding-top: 0.25rem;
    transition:
      transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.18s ease;

    html[data-mobile-chrome-hidden="true"] & {
      transform: translateY(calc(100% + 0.5rem));
      opacity: 0;
      pointer-events: none;
    }
  }
`

const tabLabel = `
  font-size: 0.5625rem;
  line-height: 0.6875rem;
  letter-spacing: -0.01em;
  margin-top: 0.0625rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const tabBase = `
  flex: 1 1 0;
  min-width: 0;
  margin: 0;
  padding: 0.125rem 0.125rem 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0;
  font: inherit;
  text-decoration: none;
  color: var(--muted-foreground);

  &[aria-current="page"] {
    color: var(--foreground);
  }

  span[data-tab-label] {
    ${tabLabel}
    font-weight: 500;
    color: inherit;
  }

  &[aria-current="page"] span[data-tab-label] {
    font-weight: 600;
  }

  &:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
`

export const TabNavLink = styled(NavLink)`
  ${tabBase}
`

export const TabButton = styled.button.attrs({ type: "button" })`
  ${tabBase}
`

export const IconSlot = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
`

export const BellBadge = styled.span`
  position: absolute;
  top: -0.1875rem;
  right: -0.3125rem;
  min-width: 0.875rem;
  height: 0.875rem;
  padding: 0 0.1875rem;
  border-radius: 999px;
  background: #ff3b30;
  color: #fff;
  font-size: 0.5rem;
  font-weight: 600;
  line-height: 0.875rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 0 0 1.5px var(--card);
`
