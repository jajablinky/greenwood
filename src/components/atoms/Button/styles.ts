import { Button as ButtonPrimitive } from "@base-ui/react/button"
import styled, { css } from "styled-components"

type BtnVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link"
  | "vote"

type BtnVoteDirection = "up" | "down"

type BtnSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"

const voteBaseCss = css`
  background: transparent;
  color: var(--muted-foreground);
`

const voteUpToneCss = css`
  &:hover:not(:disabled),
  &[aria-pressed="true"] {
    background: color-mix(in oklab, var(--color-alt-green-mint) 42%, transparent);
    color: var(--color-alt-green-deep);
  }

  .dark &:hover:not(:disabled),
  .dark &[aria-pressed="true"] {
    background: color-mix(in oklab, var(--color-alt-green-mint) 52%, transparent);
    color: var(--color-alt-green-deep);
  }
`

const voteDownToneCss = css`
  &:hover:not(:disabled),
  &[aria-pressed="true"] {
    background: color-mix(in oklab, var(--color-alt-red-salmon) 42%, transparent);
    color: var(--color-alt-red-deep);
  }

  .dark &:hover:not(:disabled),
  .dark &[aria-pressed="true"] {
    background: color-mix(in oklab, var(--color-alt-red-salmon) 52%, transparent);
    color: var(--color-alt-red-deep);
  }
`

const variantCss: Record<Exclude<BtnVariant, "vote">, ReturnType<typeof css>> = {
  default: css`
    background: var(--primary);
    color: var(--primary-foreground);
    &:hover:not(:disabled) {
      background: color-mix(in oklab, var(--primary) 80%, transparent);
    }
  `,
  outline: css`
    border-color: var(--border);
    background: var(--background);
    &:hover:not(:disabled),
    &[aria-expanded="true"] {
      background: var(--muted);
      color: var(--foreground);
    }
    .dark & {
      background: transparent;
    }
    .dark &:hover:not(:disabled),
    .dark &[aria-expanded="true"] {
      background: color-mix(in oklab, var(--input) 30%, transparent);
    }
  `,
  secondary: css`
    background: var(--secondary);
    color: var(--secondary-foreground);
    &:hover:not(:disabled) {
      background: color-mix(in oklab, var(--secondary) 80%, transparent);
    }
    &[aria-expanded="true"] {
      background: var(--secondary);
      color: var(--secondary-foreground);
    }
  `,
  ghost: css`
    background: transparent;

    &:hover:not(:disabled) {
      background: var(--accent);
      color: var(--accent-foreground);
    }

    .dark & {
      background: transparent;
    }

    .dark &:hover:not(:disabled) {
      background: var(--muted);
      color: var(--foreground);
    }
  `,
  destructive: css`
    background: color-mix(in oklab, var(--destructive) 10%, transparent);
    color: var(--destructive);
    &:hover:not(:disabled) {
      background: color-mix(in oklab, var(--destructive) 20%, transparent);
    }
    &:focus-visible {
      border-color: color-mix(in oklab, var(--destructive) 40%, transparent);
      box-shadow: 0 0 0 3px
        color-mix(in oklab, var(--destructive) 20%, transparent);
    }
    .dark & {
      background: color-mix(in oklab, var(--destructive) 20%, transparent);
    }
    .dark &:hover:not(:disabled) {
      background: color-mix(in oklab, var(--destructive) 30%, transparent);
    }
    .dark &:focus-visible {
      box-shadow: 0 0 0 3px
        color-mix(in oklab, var(--destructive) 40%, transparent);
    }
  `,
  link: css`
    border-color: transparent;
    background: transparent;
    color: var(--primary);
    text-underline-offset: 4px;
    padding-inline: 0;
    height: auto;
    min-height: 0;
    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  `,
}

const sizeCss: Record<BtnSize, ReturnType<typeof css>> = {
  default: css`
    height: 2.25rem;
    gap: 0.375rem;
    padding-inline: 0.75rem;
    & svg:not([class*="size-"]) {
      width: 1rem;
      height: 1rem;
    }
  `,
  xs: css`
    height: 1.5rem;
    gap: 0.25rem;
    padding-inline: 0.625rem;
    font-size: 0.75rem;
    & svg:not([class*="size-"]) {
      width: 0.75rem;
      height: 0.75rem;
    }
  `,
  sm: css`
    height: 2rem;
    gap: 0.25rem;
    padding-inline: 0.75rem;
  `,
  lg: css`
    height: 2.5rem;
    gap: 0.375rem;
    padding-inline: 1rem;
  `,
  icon: css`
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    gap: 0;
  `,
  "icon-xs": css`
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    gap: 0;
    & svg:not([class*="size-"]) {
      width: 0.75rem;
      height: 0.75rem;
    }
  `,
  "icon-sm": css`
    width: 2rem;
    height: 2rem;
    padding: 0;
    gap: 0;
  `,
  "icon-lg": css`
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    gap: 0;
  `,
}

export const StyledButton = styled(ButtonPrimitive)<{
  $variant: BtnVariant
  $size: BtnSize
  $voteDirection?: BtnVoteDirection
}>`
  box-sizing: border-box;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-4xl);
  border: 1px solid transparent;
  background-clip: padding-box;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition-property: color, background-color, border-color, box-shadow,
    transform;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  user-select: none;

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 30%, transparent);
  }

  &:active:not([aria-haspopup]) {
    transform: translateY(1px);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[aria-invalid="true"] {
    border-color: var(--destructive);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 20%, transparent);
  }

  .dark &[aria-invalid="true"] {
    border-color: color-mix(in oklab, var(--destructive) 50%, transparent);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--destructive) 40%, transparent);
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*="size-"]) {
    width: 1rem;
    height: 1rem;
  }

  ${({ $variant, $voteDirection }) =>
    $variant === "vote"
      ? css`
          ${voteBaseCss}
          ${$voteDirection === "down" ? voteDownToneCss : voteUpToneCss}
        `
      : variantCss[$variant]}
  ${({ $size }) => sizeCss[$size]}
`

export type { BtnSize, BtnVariant, BtnVoteDirection }
