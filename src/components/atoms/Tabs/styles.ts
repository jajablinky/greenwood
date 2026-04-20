import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import styled, { css } from "styled-components"

export const TabsRoot = styled(TabsPrimitive.Root)`
  display: flex;
  gap: 0.5rem;

  &[data-orientation="horizontal"] {
    flex-direction: column;
  }
`

export const TabsListEl = styled(TabsPrimitive.List)<{ $variant: "default" | "line" }>`
  position: relative;
  display: inline-flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground);

  [data-slot="tabs"][data-orientation="horizontal"] & {
    height: auto;
  }

  [data-slot="tabs"][data-orientation="vertical"] & {
    height: fit-content;
    flex-direction: column;
  }

  ${({ $variant }) =>
    $variant === "line"
      ? css`
          gap: 1.5rem;
          background: transparent;
          border-radius: 0;
        `
      : css`
          gap: 0.25rem;
          border: 1px solid var(--border);
          background: color-mix(in oklab, var(--muted) 70%, transparent);
          padding: 0.25rem;
        `}
`

export const TabsIndicatorEl = styled(TabsPrimitive.Indicator)<{
  $variant: "default" | "line"
}>`
  pointer-events: none;
  position: absolute;
  z-index: 0;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  ${({ $variant }) =>
    $variant === "line"
      ? css`
          border-radius: 9999px;
          background: var(--foreground);

          [data-slot="tabs"][data-orientation="horizontal"] & {
            bottom: 0;
            height: 2px;
            width: var(--active-tab-width, 0px);
            left: var(--active-tab-left, 0px);
            transition-property: left, width;
          }

          [data-slot="tabs"][data-orientation="vertical"] & {
            left: var(--active-tab-left, 0px);
            top: var(--active-tab-top, 0px);
            width: 2px;
            height: var(--active-tab-height, 0px);
            transition-property: left, top, height;
          }
        `
      : css`
          border-radius: var(--radius-md);
          background: var(--background);
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
          left: var(--active-tab-left, 0px);
          top: var(--active-tab-top, 0px);
          height: var(--active-tab-height, 0px);
          width: var(--active-tab-width, 0px);
          transition-property: left, top, width, height;

          .dark & {
            background: color-mix(in oklab, var(--input) 30%, transparent);
          }
        `}
`

export const TabsTriggerEl = styled(TabsPrimitive.Tab)`
  position: relative;
  z-index: 10;
  display: inline-flex;
  height: 2.5rem;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  color: color-mix(in oklab, var(--foreground) 55%, transparent);
  transition-property: color, background-color, border-color, box-shadow;
  transition-duration: 150ms;

  [data-slot="tabs"][data-orientation="vertical"] & {
    width: 100%;
    justify-content: flex-start;
    padding-inline: 1rem;
  }

  &:hover:not(:disabled) {
    color: var(--foreground);
  }

  &:focus-visible {
    border-color: var(--ring);
    outline: 1px solid var(--ring);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
  }

  &:disabled,
  &[aria-disabled="true"] {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*="size-"]) {
    width: 1rem;
    height: 1rem;
  }

  .dark & {
    color: var(--muted-foreground);
  }

  .dark &:hover:not(:disabled) {
    color: var(--foreground);
  }

  [data-slot="tabs-list"][data-variant="default"] &[data-active] {
    background: transparent;
    color: var(--foreground);
  }

  .dark [data-slot="tabs-list"][data-variant="default"] &[data-active] {
    background: transparent;
  }

  [data-slot="tabs-list"][data-variant="line"] & {
    height: 2.75rem;
    background: transparent;
    padding: 0;
    color: color-mix(in oklab, var(--foreground) 50%, transparent);
  }

  [data-slot="tabs-list"][data-variant="line"] &[data-active] {
    background: transparent;
    color: var(--foreground);
  }

  .dark [data-slot="tabs-list"][data-variant="line"] &[data-active] {
    border-color: transparent;
    background: transparent;
  }
`

export const TabsContentEl = styled(TabsPrimitive.Panel)`
  flex: 1;
  font-size: 0.875rem;
  outline: none;
`
