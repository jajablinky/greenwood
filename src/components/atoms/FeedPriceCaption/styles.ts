import styled, { css } from "styled-components"

function changeToneCss(change: string) {
  if (change.startsWith("+")) {
    return css`
      color: var(--color-alt-green-deep);
      .dark & {
        color: var(--color-alt-green-lime);
      }
    `
  }
  if (change.startsWith("-")) {
    return css`
      color: var(--color-alt-red-deep);
      .dark & {
        color: var(--color-alt-red-smooth);
      }
    `
  }
  return css`
    color: var(--muted-foreground);
  `
}

export const Root = styled.p<{ $inline: boolean }>`
  display: flex;
  min-width: 0;
  flex-wrap: nowrap;
  align-items: baseline;
  justify-content: flex-start;
  text-align: left;
  flex-shrink: 0;
  ${({ $inline }) =>
    $inline
      ? css`
          column-gap: 0.25rem;
          color: var(--foreground);
          @media (min-width: 640px) {
            column-gap: 0.375rem;
          }
        `
      : css`
          column-gap: 0.5rem;
          @media (min-width: 640px) {
            column-gap: 0.625rem;
          }
        `}
`

export const MarketRow = styled.span<{ $inline: boolean }>`
  display: inline-flex;
  align-items: baseline;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--foreground);
  column-gap: 0.125rem;
  ${({ $inline }) =>
    $inline
      ? css`
          font-size: 11px;
          @media (min-width: 640px) {
            font-size: 0.75rem;
          }
        `
      : css`
          font-size: 0.75rem;
          @media (min-width: 640px) {
            column-gap: 0.25rem;
            font-size: 1rem;
          }
        `}
`

export const Abbr = styled.abbr`
  cursor: default;
  font-weight: 500;
  text-decoration: none;
`

export const Change = styled.span<{ $change: string; $inline: boolean }>`
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  ${({ $change }) => changeToneCss($change)}
  ${({ $inline }) =>
    $inline
      ? css`
          font-size: 10px;
          @media (min-width: 640px) {
            font-size: 11px;
          }
        `
      : css`
          font-size: 11px;
          @media (min-width: 640px) {
            font-size: 0.875rem;
          }
        `}
`
