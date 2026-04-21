import styled from "styled-components"
import { Link } from "react-router-dom"

export const ProfileStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
`

export const Section = styled.section`
  min-width: 0;
`

export const SectionTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--muted-foreground);
`

export const RowList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: var(--radius-md);
  border: 1px solid color-mix(in oklab, var(--border) 85%, transparent);
  background: color-mix(in oklab, var(--card) 88%, transparent);
  overflow: hidden;
`

export const RowLink = styled(Link)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  text-decoration: none;
  color: var(--foreground);
  font-size: 0.875rem;
  line-height: 1.35;
  border-bottom: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
  transition: background-color 120ms ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: color-mix(in oklab, var(--foreground) 4%, transparent);
  }
`

export const RowMain = styled.span`
  min-width: 0;
  font-weight: 500;
`

export const RowMeta = styled.span`
  flex-shrink: 0;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  font-variant-numeric: tabular-nums;
`

export const RowExcerpt = styled.span`
  display: block;
  margin-top: 0.2rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--muted-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
