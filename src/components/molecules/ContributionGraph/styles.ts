import styled, { css } from "styled-components"

const CELL = "0.68rem"
const GAP = "0.18rem"

export const Card = styled.section`
  --cell: ${CELL};
  --gap: ${GAP};
  border: 0;
  border-radius: var(--radius-md);
  /* In profile, --profile-text-inset (set on ProfileStack) lines the title up with name / tabs. */
  padding: 0.5rem 0.55rem 0.45rem;
  padding-left: var(--profile-text-inset, 0.55rem);
  background: color-mix(in oklab, var(--card) 70%, transparent);
  overflow: hidden;
`

export const Title = styled.h2`
  margin: 0 0 0.45rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
  line-height: 1.2;
`

/** Horizontal scroll wrapper — narrow viewports keep the grid on one line. */
export const Scroller = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
`

/**
 * `[empty][months]` on top, `[day-labels][grid]` on the second row.
 * Using an explicit template prevents the month labels from drifting when the
 * browser rounds sub-pixel column widths.
 */
export const Layout = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 0.35rem;
  min-width: max-content;

  ${(p) => css`
    --graph-cols: ${p.$cols};
  `}
`

export const MonthRow = styled.div`
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(var(--graph-cols), var(--cell));
  column-gap: var(--gap);
  font-size: 0.6875rem;
  color: var(--muted-foreground);
  line-height: 1;
`

export const MonthLabel = styled.span<{ $col: number }>`
  grid-column: ${(p) => p.$col + 1} / span 3;
  white-space: nowrap;
`

export const DayCol = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-rows: repeat(7, var(--cell));
  row-gap: var(--gap);
  padding-right: 0.4rem;
  font-size: 0.6875rem;
  color: var(--muted-foreground);
  line-height: 1;
`

export const DayLabel = styled.span<{ $row: number }>`
  grid-row: ${(p) => p.$row + 1};
  align-self: center;
`

export const Grid = styled.div`
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(var(--graph-cols), var(--cell));
  grid-auto-rows: var(--cell);
  column-gap: var(--gap);
  row-gap: var(--gap);
`

const levelColor = (level: 0 | 1 | 2 | 3 | 4) => {
  switch (level) {
    case 0:
      return css`
        background: color-mix(in oklab, var(--muted) 45%, transparent);
        .dark & {
          background: color-mix(in oklab, var(--foreground) 8%, transparent);
        }
      `
    case 1:
      return css`
        background: oklch(0.9 0.08 150);
        .dark & {
          background: oklch(0.35 0.08 150);
        }
      `
    case 2:
      return css`
        background: oklch(0.82 0.13 150);
        .dark & {
          background: oklch(0.48 0.13 150);
        }
      `
    case 3:
      return css`
        background: oklch(0.72 0.17 150);
        .dark & {
          background: oklch(0.6 0.17 150);
        }
      `
    case 4:
      return css`
        background: oklch(0.55 0.19 150);
        .dark & {
          background: oklch(0.72 0.19 150);
        }
      `
  }
}

export const Cell = styled.span<{
  $col: number
  $row: number
  $level: 0 | 1 | 2 | 3 | 4
}>`
  grid-column: ${(p) => p.$col + 1};
  grid-row: ${(p) => p.$row + 1};
  border-radius: 2px;
  ${(p) => levelColor(p.$level)}
`

export const Legend = styled.div`
  margin-top: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
  font-size: 0.6875rem;
  color: var(--muted-foreground);
`

export const LegendSwatch = styled.span<{ $level: 0 | 1 | 2 | 3 | 4 }>`
  display: inline-block;
  width: var(--cell);
  height: var(--cell);
  border-radius: 2px;
  ${(p) => levelColor(p.$level)}
`
