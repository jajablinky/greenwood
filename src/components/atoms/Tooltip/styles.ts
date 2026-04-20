import { Tooltip as TooltipParts } from "@base-ui/react/tooltip"
import styled from "styled-components"

export const Positioner = styled(TooltipParts.Positioner)`
  isolation: isolate;
  z-index: 50;
`

export const Popup = styled(TooltipParts.Popup)`
  z-index: 50;
  display: inline-flex;
  width: fit-content;
  max-width: 20rem;
  align-items: center;
  gap: 0.375rem;
  border-radius: var(--radius-xl);
  background: var(--foreground);
  color: var(--background);
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  transform-origin: var(--transform-origin, center);
  transition: opacity 150ms ease, transform 150ms ease;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.96);
  }

  &[data-open] {
    opacity: 1;
    transform: scale(1);
  }

  &:has([data-slot="kbd"]) {
    padding-right: 0.375rem;
  }

  & [data-slot="kbd"] {
    position: relative;
    z-index: 50;
    isolation: isolate;
    border-radius: var(--radius-md);
  }
`

export const Arrow = styled(TooltipParts.Arrow)`
  z-index: 50;
  width: 10px;
  height: 10px;
  rotate: 45deg;
  border-radius: 2px;
  background: var(--foreground);
  fill: var(--foreground);
`
