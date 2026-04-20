import styled from "styled-components"

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 1px solid var(--border);
  color: var(--muted-foreground);
  background: var(--muted);

  &[data-status="running"] {
    border-color: rgba(59, 130, 246, 0.45);
    color: #1d4ed8;
    background: rgba(219, 234, 254, 0.6);
  }

  &[data-status="stuck"] {
    border-color: rgba(245, 158, 11, 0.5);
    color: #b45309;
    background: rgba(254, 243, 199, 0.7);
  }

  &[data-status="done"] {
    border-color: rgba(34, 197, 94, 0.45);
    color: #15803d;
    background: rgba(220, 252, 231, 0.7);
  }

  &[data-status="error"] {
    border-color: rgba(239, 68, 68, 0.45);
    color: #b91c1c;
    background: rgba(254, 226, 226, 0.7);
  }

  &[data-status="starting"] {
    border-color: rgba(100, 116, 139, 0.45);
    color: #475569;
    background: rgba(241, 245, 249, 0.8);
  }
`
