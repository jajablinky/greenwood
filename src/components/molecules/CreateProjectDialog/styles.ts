import styled from "styled-components"

export const StepHint = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--muted-foreground);
`

export const Form = styled.form`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
`

export const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
`

export const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: var(--foreground);
`

export const TextInput = styled.input`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--foreground);
  font: inherit;
  font-size: 13px;
  padding: 8px 10px;
  outline: none;

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ring) 25%, transparent);
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`

export const RemixRibbon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in oklab, oklch(0.65 0.15 250) 35%, transparent);
  background: color-mix(in oklab, oklch(0.65 0.15 250) 12%, transparent);
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--foreground);

  .dark & {
    border-color: color-mix(in oklab, oklch(0.55 0.12 250) 40%, transparent);
    background: color-mix(in oklab, oklch(0.45 0.12 250) 22%, transparent);
  }
`

export const RemixRibbonBadge = styled.span`
  border-radius: 9999px;
  background: color-mix(in oklab, oklch(0.55 0.14 250) 45%, transparent);
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: oklch(0.28 0.1 250);

  .dark & {
    background: color-mix(in oklab, oklch(0.65 0.12 250) 35%, transparent);
    color: oklch(0.95 0.04 250);
  }
`

export const RemixRibbonText = styled.span`
  min-width: 0;
  flex: 1 1 0%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RemixPreviewWrap = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const RemixPreviewLabel = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25;
  color: var(--muted-foreground);
`

export const RemixPreviewFrame = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--muted);
  aspect-ratio: 16 / 9;
  max-height: 14rem;
`
