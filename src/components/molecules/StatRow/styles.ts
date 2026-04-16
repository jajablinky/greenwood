import styled, { css } from "styled-components"

export const StatRowListDl = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const StatRowListUl = styled.ul`
  margin: 0;
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

const rowShell = ($striped?: boolean) => css`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  @media (min-width: 640px) {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  ${$striped &&
  css`
    border-radius: 0.5rem;
    background: rgb(0 0 0 / 2%);
    .dark & {
      background: rgb(255 255 255 / 4%);
    }
  `}
`

export const StatRowDiv = styled.div<{ $striped?: boolean }>`
  ${({ $striped }) => rowShell($striped)}
`

export const StatRowLi = styled.li<{ $striped?: boolean }>`
  ${({ $striped }) => rowShell($striped)}
`

export const StatRowDt = styled.dt`
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 0.75rem;
  color: var(--muted-foreground);
`

export const IconSlot = styled.span`
  display: flex;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`

export const LabelText = styled.span`
  font-size: 0.875rem;
  line-height: 1.25rem;
`

export const StatRowDd = styled.dd`
  min-width: 0;
  text-align: right;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--foreground);
`

export const StatRowValueDiv = styled.div`
  min-width: 0;
  text-align: right;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--foreground);
`
