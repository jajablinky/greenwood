import { NavLink } from "react-router-dom"
import styled, { css } from "styled-components"

/** Icon-only bar — shorter than labeled tabs. */
const mobileTabBarReserve = css`
  padding-bottom: calc(3rem + env(safe-area-inset-bottom, 0px));
  transition: padding-bottom 0.22s cubic-bezier(0.4, 0, 0.2, 1);

  html[data-mobile-chrome-hidden="true"] & {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
`

/** Space reserved under scrollable content (tab bar). */
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
    padding-bottom: calc(0.4rem + env(safe-area-inset-bottom, 0px));
    justify-content: space-around;
    align-items: center;
    gap: 0;
    border-top: 0.33px solid color-mix(in oklab, var(--foreground) 12%, transparent);
    background: color-mix(in oklab, var(--card) 96%, transparent);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    font-family:
      -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui,
      sans-serif;
    -webkit-tap-highlight-color: transparent;
    padding-top: 0.35rem;
    min-height: calc(2.75rem + env(safe-area-inset-bottom, 0px));
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

const tabBase = `
  flex: 1 1 0;
  min-width: 0;
  margin: 0;
  padding: 0.35rem 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  font: inherit;
  text-decoration: none;
  color: var(--muted-foreground);
  position: relative;

  &[aria-current="page"] {
    color: var(--foreground);
  }

  &[aria-current="page"]::before {
    content: "";
    position: absolute;
    top: 0.1rem;
    left: 50%;
    width: 0.25rem;
    height: 0.25rem;
    margin-left: -0.125rem;
    border-radius: 999px;
    background: var(--ring);
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
