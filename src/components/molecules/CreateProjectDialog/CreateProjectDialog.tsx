"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { Button } from "components/atoms/Button"
import { AppPreviewPhoneExpand } from "components/molecules/AppPreviewPhoneExpand/AppPreviewPhoneExpand"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/atoms/Dialog"
import type { GlobalFeedItem } from "helpers/activity-feed-mock-data"
import { APP_MOCK_ONLY } from "helpers/app-mode"
import { activityDetailPath } from "helpers/app-route-name"
import {
  ouroFeedIdForSlug,
  remixDescription,
  workspaceSlugFromFeedId,
} from "helpers/ouro-feed-items"
import { mockWorkspaceSnapshotFromName } from "helpers/mock-workspace-snapshot"
import { createWorkspace, listFolders } from "helpers/ouroboros/api"
import { useArweaveProvider } from "providers/ArweaveProvider"
import { useProjects } from "providers/ProjectsProvider"
import { useToaster } from "providers/ToasterProvider"

import * as S from "./styles"

/** Bootstrap prompt until the user describes the desired look on the detail page. */
const DEFAULT_TEAM_LEAD_PROMPT =
  "The user will say what they want this project to look like in the thread — greet them and help plan the work."

const REMIX_TEAM_LEAD_BOOTSTRAP = (parentTitle: string) =>
  `Remix of "${parentTitle}": the user will describe what this fork should do differently — greet them and help plan the work.`

/** Match `FeedMain` column; ~33% narrower than the former 48rem / 40rem caps. */
const CreateProjectDialogContent = styled(DialogContent)`
  width: min(100% - 2rem, calc(48rem * 0.67));
  max-width: min(calc(48rem * 0.67), calc(100vw - 2rem));

  @media (min-width: 640px) {
    width: min(100% - 2rem, calc(40rem * 0.67));
    max-width: min(calc(40rem * 0.67), calc(100vw - 2rem));
  }
`

export type CreateProjectRemixSource = Pick<
  GlobalFeedItem,
  "id" | "appName" | "appSlug" | "previewHtml" | "cardTitle"
>

export function CreateProjectDialog({
  open,
  onOpenChange,
  remixSource,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When set, dialog shows the source app preview and remix affordances (feed “Remix”). */
  remixSource?: CreateProjectRemixSource | null
}) {
  const navigate = useNavigate()
  const { walletAddress, connect } = useArweaveProvider()
  const { push } = useToaster()
  const { addWorkspace } = useProjects()
  const [name, setName] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const projectNameInputRef = React.useRef<HTMLInputElement>(null)

  const reset = React.useCallback(() => {
    setName("")
  }, [])

  React.useEffect(() => {
    if (!open) {
      reset()
      return
    }
    if (remixSource) {
      const base = remixSource.cardTitle ?? remixSource.appName
      setName(`${base} remix`)
    }
  }, [open, remixSource, reset])

  React.useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => {
      projectNameInputRef.current?.focus()
    }, 0)
    return () => window.clearTimeout(id)
  }, [open])

  const createProject = React.useCallback(async () => {
    const n = name.trim()
    if (!n) {
      push({ title: "Enter a project name", variant: "warning" })
      return
    }

    const parentTitle = remixSource?.cardTitle ?? remixSource?.appName
    const parentSlugForRemix =
      remixSource &&
      (workspaceSlugFromFeedId(remixSource.id) ?? remixSource.appSlug)

    if (APP_MOCK_ONLY) {
      setBusy(true)
      try {
        const snapshot = mockWorkspaceSnapshotFromName(
          n,
          remixSource && parentSlugForRemix
            ? { description: remixDescription(parentSlugForRemix) }
            : undefined,
        )
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
      const teamLead =
        remixSource && parentTitle
          ? REMIX_TEAM_LEAD_BOOTSTRAP(parentTitle)
          : DEFAULT_TEAM_LEAD_PROMPT

      const snapshot = await createWorkspace({
        name: n,
        folder_path: folderPath,
        team_lead_prompt: teamLead,
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
  }, [
    addWorkspace,
    connect,
    name,
    navigate,
    onOpenChange,
    push,
    reset,
    remixSource,
    walletAddress,
  ])

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
          <DialogTitle>
            {remixSource ? "Create remix" : "Create App"}
          </DialogTitle>
          <S.StepHint>
            {remixSource
              ? APP_MOCK_ONLY
                ? "You’re forking from the app below — name your remix, then open the workspace chat."
                : "You’re forking from the app below — name your remix, then describe what should change in the workspace."
              : APP_MOCK_ONLY
                ? "Demo: name only — opens a mock workspace page (no server)."
                : "Name your project — you’ll open the workspace chat to describe what you’re building."}
          </S.StepHint>
        </DialogHeader>
        {remixSource ? (
          <>
            <S.RemixRibbon>
              <S.RemixRibbonBadge>Remix</S.RemixRibbonBadge>
              <S.RemixRibbonText title={remixSource.appName}>
                From {remixSource.cardTitle ?? remixSource.appName}
              </S.RemixRibbonText>
            </S.RemixRibbon>
            <S.RemixPreviewWrap>
              <S.RemixPreviewLabel>Source app preview</S.RemixPreviewLabel>
              <S.RemixPreviewFrame>
                <AppPreviewPhoneExpand
                  previewKey={remixSource.id}
                  previewHtml={remixSource.previewHtml}
                  title={`${remixSource.appName} preview`}
                  variant="dialog"
                />
              </S.RemixPreviewFrame>
            </S.RemixPreviewWrap>
          </>
        ) : null}
        <S.Form onSubmit={onFormSubmit}>
          <S.Field>
            <S.Label htmlFor="ouro-project-name">Project name</S.Label>
            <S.TextInput
              ref={projectNameInputRef}
              id="ouro-project-name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="My protocol"
              autoComplete="off"
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
              {busy
                ? "Creating…"
                : remixSource
                  ? "Create remix"
                  : "Create project"}
            </Button>
          </S.Actions>
        </S.Form>
      </CreateProjectDialogContent>
    </Dialog>
  )
}
