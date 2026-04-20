"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { Button } from "components/atoms/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/atoms/Dialog"
import { APP_MOCK_ONLY } from "helpers/app-mode"
import { activityDetailPath } from "helpers/app-route-name"
import { ouroFeedIdForSlug } from "helpers/ouro-feed-items"
import { mockWorkspaceSnapshotFromName } from "helpers/mock-workspace-snapshot"
import { createWorkspace, listFolders } from "helpers/ouroboros/api"
import { useArweaveProvider } from "providers/ArweaveProvider"
import { useProjects } from "providers/ProjectsProvider"
import { useToaster } from "providers/ToasterProvider"

import * as S from "./styles"

/** Bootstrap prompt until the user describes the build in #general on the detail page. */
const DEFAULT_TEAM_LEAD_PROMPT =
  "The user will describe what they want to build in #general chat — greet them and help plan the work."

/** Match `FeedMain` max-width so the dialog aligns with the activity feed column. */
const CreateProjectDialogContent = styled(DialogContent)`
  width: min(100% - 2rem, 48rem);
  max-width: min(48rem, calc(100vw - 2rem));

  @media (min-width: 640px) {
    width: min(100% - 2rem, 40rem);
    max-width: min(40rem, calc(100vw - 2rem));
  }
`

export function CreateProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const { walletAddress, connect } = useArweaveProvider()
  const { push } = useToaster()
  const { addWorkspace } = useProjects()
  const [name, setName] = React.useState("")
  const [busy, setBusy] = React.useState(false)

  const reset = React.useCallback(() => {
    setName("")
  }, [])

  React.useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const createProject = React.useCallback(async () => {
    const n = name.trim()
    if (!n) {
      push({ title: "Enter a project name", variant: "warning" })
      return
    }

    if (APP_MOCK_ONLY) {
      setBusy(true)
      try {
        const snapshot = mockWorkspaceSnapshotFromName(n)
        addWorkspace(snapshot)
        const feedId = ouroFeedIdForSlug(snapshot.workspace.slug)
        reset()
        onOpenChange(false)
        navigate(activityDetailPath(feedId), { state: { scrollToComments: true } })
        push({
          title: "Project created (demo)",
          body: snapshot.workspace.name,
          variant: "success",
        })
      } finally {
        setBusy(false)
      }
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
        team_lead_prompt: DEFAULT_TEAM_LEAD_PROMPT,
      })
      addWorkspace(snapshot)
      const feedId = ouroFeedIdForSlug(snapshot.workspace.slug)
      reset()
      onOpenChange(false)
      navigate(activityDetailPath(feedId), { state: { scrollToComments: true } })
      push({ title: "Workspace created", body: snapshot.workspace.name, variant: "success" })
    } catch (err) {
      push({
        variant: "warning",
        title: "Could not create workspace",
        body: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setBusy(false)
    }
  }, [addWorkspace, connect, name, navigate, onOpenChange, push, reset, walletAddress])

  const onFormSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      await createProject()
    },
    [createProject],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CreateProjectDialogContent>
        <DialogHeader>
          <DialogTitle>Create App</DialogTitle>
          <S.StepHint>
            {APP_MOCK_ONLY
              ? "Demo: name only — opens a mock workspace page (no server)."
              : "Name your project — you’ll open the workspace chat to describe what you’re building."}
          </S.StepHint>
        </DialogHeader>
        <S.Form onSubmit={onFormSubmit}>
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
              {busy ? "Creating…" : "Create project"}
            </Button>
          </S.Actions>
        </S.Form>
      </CreateProjectDialogContent>
    </Dialog>
  )
}
