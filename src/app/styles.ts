import { createGlobalStyle, css } from "styled-components"

/**
 * Design tokens, global baseline, and shared utilities (replaces legacy `index.css` theme).
 */
const cssVariables = css`
  :root {
    --background: oklch(0.988 0 0);
    --foreground: oklch(0.16 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.16 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.16 0 0);
    --primary: oklch(0.93 0 0);
    --primary-foreground: oklch(0.2 0 0);
    --secondary: oklch(0.972 0 0);
    --secondary-foreground: oklch(0.16 0 0);
    --muted: oklch(0.976 0 0);
    --muted-foreground: oklch(0.5 0 0);
    --accent: oklch(0.976 0 0);
    --accent-foreground: oklch(0.16 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.9 0 0);
    --input: oklch(0.952 0 0);
    --ring: oklch(0.62 0 0);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --radius: 0.625rem;
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
    --font-sans: "DM Sans", sans-serif;
    --color-alt-blue-light: oklch(0.9585 0.0225 237.64);
    --color-alt-blue-baby: oklch(0.9266 0.0416 234.82);
    --color-alt-blue-lavender: oklch(0.8452 0.0767 274.89);
    --color-alt-blue-deep: oklch(0.546 0.1582 250.87);
    --color-alt-red-light: oklch(0.9408 0.0297 17.69);
    --color-alt-red-salmon: oklch(0.8918 0.0568 18.27);
    --color-alt-red-smooth: oklch(0.7622 0.1425 40.25);
    --color-alt-red-deep: oklch(0.5397 0.2122 20.76);
    --color-alt-green-light: oklch(0.9748 0.0395 152.16);
    --color-alt-green-mint: oklch(0.9554 0.072 152.17);
    --color-alt-green-lime: oklch(0.9445 0.1502 126.28);
    --color-alt-green-deep: oklch(0.5646 0.1805 144.46);
    --color-permaweb-red-1-deep: #cd0d34;
    --color-permaweb-red-2-smooth: #fd9069;
    --color-permaweb-red-3-salmon: #ffcdcd;
    --color-permaweb-red-4-light: #ffe4e4;
    --color-permaweb-green-1-deep: #008f20;
    --color-permaweb-green-2-lime: #d3ff8c;
    --color-permaweb-green-3-mint: #cdffd9;
    --color-permaweb-green-4-light: #e4ffea;
    --color-permaweb-blue-1-deep: #0072c8;
    --color-permaweb-blue-2-lavender: #bdc9ff;
    --color-permaweb-blue-3-baby: #cdecff;
    --color-permaweb-blue-4-light: #e4f4ff;
    --color-permaweb-violet-deep: #5b21b6;
    --color-permaweb-violet-soft: #ede9fe;
    --color-permaweb-amber-deep: #d97706;
    --color-permaweb-amber-soft: #fef3c7;
    --color-permaweb-cyan-deep: #0891b2;
    --color-permaweb-cyan-soft: #cffafe;
    --color-permaweb-rose-deep: #e11d48;
    --color-permaweb-rose-soft: #ffe4e6;
  }

  .dark {
    --background: oklch(0.16 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.19 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.94 0 0);
    --primary-foreground: oklch(0.18 0 0);
    --secondary: oklch(0.24 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.23 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.23 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.94 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.556 0 0);
  }
`

const baseRules = css`
  * {
    border-color: var(--border);
    outline-color: color-mix(in oklab, var(--ring) 50%, transparent);
  }

  body {
    background: var(--background);
    color: var(--foreground);
  }

  html,
  body,
  button,
  input,
  textarea,
  select {
    font-family: var(--font-sans);
  }

  textarea {
    resize: none;
  }

  body,
  #root {
    min-height: 100svh;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  strong,
  b {
    font-weight: 500;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`

const feedCardHover = css`
  .feed-card-hover-accent {
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .feed-card-hover-accent:hover {
    background-color: color-mix(
      in oklab,
      var(--feed-hover-accent) 5%,
      var(--card)
    );
  }
  .dark .feed-card-hover-accent:hover {
    background-color: color-mix(
      in oklab,
      var(--feed-hover-accent) 9%,
      var(--card)
    );
  }
`

const connectWalletPill = css`
  .connect-wallet-pill {
    flex-shrink: 0;
    min-height: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    font-size: 0.75rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    box-shadow: none;
    color: var(--muted-foreground);
  }

  .connect-wallet-pill:hover:not(:disabled) {
    color: var(--foreground);
  }

  @media (min-width: 640px) {
    .connect-wallet-pill {
      min-height: 2.5rem;
      height: 2.5rem;
    }
  }

  .dark .connect-wallet-pill {
    border-color: rgba(255, 255, 255, 0.12);
  }

  .connect-wallet-pill--checking:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  .connect-wallet-pill--missing:disabled {
    opacity: 0.6;
  }

  .connect-wallet-pill--connected {
    color: var(--foreground);
  }
`

export const GlobalStyle = createGlobalStyle`
  ${cssVariables}
  ${baseRules}
  ${feedCardHover}
  ${connectWalletPill}
`
