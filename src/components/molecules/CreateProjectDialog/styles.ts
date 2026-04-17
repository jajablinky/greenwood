import styled from "styled-components"

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

export const TextArea = styled.textarea`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 88px;
  resize: none;
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
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`
