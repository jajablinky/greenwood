"use client"

import * as React from "react"
import styled from "styled-components"

import { Button } from "components/atoms/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/atoms/Dialog"
import { createWorkspace, listFolders } from "helpers/ouroboros/api"
import { useArweaveProvider } from "providers/ArweaveProvider"
import { useProjects } from "providers/ProjectsProvider"
import { useToaster } from "providers/ToasterProvider"

import * as S from "./styles"

const CreateProjectDialogContent = styled(DialogContent)`
  max-width: min(440px, calc(100vw - 32px));
`

export function CreateProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { walletAddress, connect } = useArweaveProvider()
  const { push } = useToaster()
  const { addWorkspace } = useProjects()
  const [step, setStep] = React.useState<1 | 2>(1)
  const [name, setName] = React.useState("")
  const [buildIntent, setBuildIntent] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const buildFieldRef = React.useRef<HTMLTextAreaElement>(null)

  const reset = React.useCallback(() => {
    setStep(1)
    setName("")
    setBuildIntent("")
  }, [])

  React.useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  React.useEffect(() => {
    if (open && step === 2) {
      const t = window.setTimeout(() => buildFieldRef.current?.focus(), 0)
      return () => window.clearTimeout(t)
    }
  }, [open, step])

  const createProject = React.useCallback(async () => {
    const n = name.trim()
    const p = buildIntent.trim()
    if (!n || !p) {
      push({ title: "Name and app description are required", variant: "warning" })
      return
    }
    if (!walletAddress) {
      await connect()
      push({ title: "Connect your wallet to create a project", variant: "warning" })
      return
    }
    setBusy(true)
    try {
      const folders = await listFolders()
      const folderPath =
        folders[0]?.path ??
        (() => {
          throw new Error("No folder — create one in Ouroboros first.")
        })()
      const snapshot = await createWorkspace({
        name: n,
        folder_path: folderPath,
        team_lead_prompt: p,
      })
      addWorkspace(snapshot)
      push({ title: "Workspace created", body: snapshot.workspace.name, variant: "success" })
      reset()
      onOpenChange(false)
    } catch (err) {
      push({
        variant: "warning",
        title: "Could not create workspace",
        body: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setBusy(false)
    }
  }, [addWorkspace, buildIntent, connect, name, onOpenChange, push, reset, walletAddress])

  const onFormSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (step === 1) {
        if (!name.trim()) {
          push({ title: "Enter a project name", variant: "warning" })
          return
        }
        setStep(2)
        return
      }
      await createProject()
    },
    [createProject, name, push, step],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CreateProjectDialogContent>
        <DialogHeader>
          <DialogTitle>Create App</DialogTitle>
          <S.StepHint>
            Step {step} of 2 —{" "}
            {step === 1 ? "Name your project" : "Describe what you’re building"}
          </S.StepHint>
        </DialogHeader>
        <S.Form onSubmit={onFormSubmit}>
          {step === 1 ? (
            <S.Field>
              <S.Label htmlFor="ouro-project-name">Project name</S.Label>
              <S.TextInput
                id="ouro-project-name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="My protocol"
                autoComplete="off"
                autoFocus
              />
            </S.Field>
          ) : (
            <S.Field>
              <S.Label htmlFor="ouro-app-kind">What kind of app do you want to build?</S.Label>
              <S.TextArea
                ref={buildFieldRef}
                id="ouro-app-kind"
                value={buildIntent}
                onChange={(e) => setBuildIntent(e.target.value)}
                placeholder="Describe the product, audience, and core workflows — the team lead uses this to plan the build."
                rows={5}
              />
            </S.Field>
          )}
          {step === 1 ? (
            <S.Actions>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={busy}>
                Next
              </Button>
            </S.Actions>
          ) : (
            <S.ActionBar>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                disabled={busy}
              >
                Back
              </Button>
              <S.TrailingActions>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={busy}>
                  {busy ? "Creating…" : "Create project"}
                </Button>
              </S.TrailingActions>
            </S.ActionBar>
          )}
        </S.Form>
      </CreateProjectDialogContent>
    </Dialog>
  )
}
