import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import styled from "styled-components"

import { Button } from "components/atoms/Button"

export const Overlay = styled(DialogPrimitive.Backdrop)`
  position: fixed;
  inset: 0;
  z-index: 50;
  isolation: isolate;
  background: rgb(0 0 0 / 0.3);
  transition: opacity 100ms ease;

  @supports (backdrop-filter: blur(4px)) {
    backdrop-filter: blur(4px);
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
  }

  &[data-open] {
    opacity: 1;
  }
`

export const Popup = styled(DialogPrimitive.Popup)`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 50;
  display: grid;
  min-width: 0;
  width: min(100% - 2rem, 28rem);
  max-width: calc(100% - 2rem);
  transform: translate(-50%, -50%) scale(1);
  gap: 1.5rem;
  border-radius: var(--radius-4xl);
  background: var(--popover);
  padding: 1.5rem;
  font-size: 0.875rem;
  color: var(--popover-foreground);
  outline: none;
  transition: opacity 100ms ease, transform 100ms ease;
  box-shadow:
    0 25px 50px -12px rgb(0 0 0 / 0.25),
    0 0 0 1px color-mix(in oklab, var(--foreground) 5%, transparent);

  .dark & {
    box-shadow:
      0 25px 50px -12px rgb(0 0 0 / 0.25),
      0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent);
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.96);
  }

  &[data-open] {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  @media (min-width: 640px) {
    max-width: 28rem;
  }

  & > * {
    min-width: 0;
  }
`

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const Footer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`

export const Title = styled(DialogPrimitive.Title)`
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1;
  font-weight: 500;
`

export const Description = styled(DialogPrimitive.Description)`
  font-size: 0.875rem;
  color: var(--muted-foreground);

  & a {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  & a:hover {
    color: var(--foreground);
  }
`

export const DialogCloseIconButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--secondary);
`
