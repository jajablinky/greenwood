import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import styled from "styled-components"

export const Root = styled(AvatarPrimitive.Root)`
  position: relative;
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
  user-select: none;

  &::after {
    content: "";
    pointer-events: none;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid var(--border);
    mix-blend-mode: darken;
  }

  .dark &::after {
    mix-blend-mode: lighten;
  }

  &[data-size="default"] {
    width: 2rem;
    height: 2rem;
  }

  &[data-size="sm"] {
    width: 1.5rem;
    height: 1.5rem;
  }

  &[data-size="lg"] {
    width: 2.5rem;
    height: 2.5rem;
  }
`

export const Image = styled(AvatarPrimitive.Image)`
  aspect-ratio: 1;
  width: 100%;
  height: 100%;
  border-radius: 0;
  object-fit: cover;
`

export const Fallback = styled(AvatarPrimitive.Fallback)<{
  $background: string
}>`
  position: absolute;
  inset: 0;
  display: flex;
  min-height: 0;
  min-width: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: inherit;
  padding: 0;
  text-align: center;
  background-color: ${({ $background }) => $background};
`

export const FigurineWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-block: 8%;
`

export const FigurineSvg = styled.svg`
  pointer-events: none;
  display: block;
  height: 100%;
  min-height: 0;
  width: auto;
  max-width: 100%;
  color: #000;
`

export const Abbr = styled.span`
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 38%;
  z-index: 1;
  translate: -50% -50%;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.05em;
  color: #fff;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35));

  [data-slot="avatar"][data-size="sm"] & {
    font-size: 8px;
  }

  [data-slot="avatar"][data-size="default"] & {
    font-size: 11px;
  }

  [data-slot="avatar"][data-size="lg"] & {
    font-size: 13px;
  }
`

export const Badge = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--primary);
  color: var(--primary-foreground);
  background-blend-mode: color;
  box-shadow: 0 0 0 2px var(--background);
  user-select: none;

  [data-slot="avatar"][data-size="sm"] & {
    width: 0.5rem;
    height: 0.5rem;
  }

  [data-slot="avatar"][data-size="sm"] & > svg {
    display: none;
  }

  [data-slot="avatar"][data-size="default"] & {
    width: 0.625rem;
    height: 0.625rem;
  }

  [data-slot="avatar"][data-size="default"] & > svg {
    width: 0.5rem;
    height: 0.5rem;
  }

  [data-slot="avatar"][data-size="lg"] & {
    width: 0.75rem;
    height: 0.75rem;
  }

  [data-slot="avatar"][data-size="lg"] & > svg {
    width: 0.5rem;
    height: 0.5rem;
  }
`

export const Group = styled.div`
  display: flex;
  margin-left: -0.5rem;

  [data-slot="avatar"] {
    box-shadow: 0 0 0 2px var(--background);
  }

  &:has([data-slot="avatar"][data-size="lg"]) [data-slot="avatar-group-count"] {
    width: 2.5rem;
    height: 2.5rem;
  }

  &:has([data-slot="avatar"][data-size="lg"])
    [data-slot="avatar-group-count"]
    > svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:has([data-slot="avatar"][data-size="sm"]) [data-slot="avatar-group-count"] {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:has([data-slot="avatar"][data-size="sm"])
    [data-slot="avatar-group-count"]
    > svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`

export const GroupCount = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--muted);
  font-size: 0.875rem;
  color: var(--muted-foreground);
  box-shadow: 0 0 0 2px var(--background);

  & > svg {
    width: 1rem;
    height: 1rem;
  }
`
