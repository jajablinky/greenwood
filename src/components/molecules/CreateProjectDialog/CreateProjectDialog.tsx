"use client"

import * as React from "react"
import styled from "styled-components"

import { Button } from "components/atoms/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/atoms/Dialog"
import { OUROBOROS_URL } from "helpers/config"
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
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [seedPrompt, setSeedPrompt] = React.useState("")
  const [busy, setBusy] = React.useState(false)

  const reset = React.useCallback(() => {
    setName("")
    setDescription("")
    setSeedPrompt("")
  }, [])

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const n = name.trim()
      const p = seedPrompt.trim()
      if (!n || !p) {
        push({ title: "Name and seed prompt are required", variant: "warning" })
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
          description: description.trim() || null,
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
    },
    [
      addWorkspace,
      connect,
      description,
      name,
      onOpenChange,
      push,
      reset,
      seedPrompt,
      walletAddress,
    ],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CreateProjectDialogContent>
        <DialogHeader>
          <DialogTitle>New Ouroboros project</DialogTitle>
          <DialogDescription>
            Creates a new workspace with a team lead agent. Requires a connected
            Arweave wallet and a running Ouroboros server (
            <code>{OUROBOROS_URL}</code>
            ).
          </DialogDescription>
        </DialogHeader>
        <S.Form onSubmit={onSubmit}>
          <S.Field>
            <S.Label htmlFor="ouro-project-name">Project name</S.Label>
            <S.TextInput
              id="ouro-project-name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="My protocol"
              autoComplete="off"
            />
          </S.Field>
          <S.Field>
            <S.Label htmlFor="ouro-project-desc">Description (optional)</S.Label>
            <S.TextInput
              id="ouro-project-desc"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Short summary"
              autoComplete="off"
            />
          </S.Field>
          <S.Field>
            <S.Label htmlFor="ouro-seed">Seed prompt for team lead</S.Label>
            <S.TextArea
              id="ouro-seed"
              value={seedPrompt}
              onChange={(e) => setSeedPrompt(e.target.value)}
              placeholder="What should the team lead build?"
              rows={4}
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
