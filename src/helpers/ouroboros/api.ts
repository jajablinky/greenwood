import type { Folder, Workspace, WorkspaceManifest, WorkspaceSnapshot } from "helpers/ouroboros/types"
import { findGeneralChannel, postChannelMessageDirect } from "helpers/ouroboros/hyperbeam-send"
import { ouroFetchJson } from "helpers/ouroboros/client"

export async function listFolders(): Promise<Folder[]> {
  return ouroFetchJson<Folder[]>("/api/folders")
}

export async function listWorkspaces(folderPath?: string | null): Promise<Workspace[]> {
  const q =
    folderPath && folderPath.trim()
      ? `?folder_path=${encodeURIComponent(folderPath)}`
      : ""
  return ouroFetchJson<Workspace[]>(`/api/workspaces${q}`)
}

export async function getWorkspace(workspaceIdOrSlug: string): Promise<WorkspaceSnapshot> {
  return ouroFetchJson<WorkspaceSnapshot>(
    `/api/workspaces/${encodeURIComponent(workspaceIdOrSlug)}`,
  )
}

export async function getWorkspaceManifest(workspaceIdOrSlug: string): Promise<WorkspaceManifest> {
  return ouroFetchJson<WorkspaceManifest>(
    `/api/workspaces/${encodeURIComponent(workspaceIdOrSlug)}/manifest`,
  )
}

export type CreateWorkspaceInput = {
  name: string
  description?: string | null
  folder_path?: string
  system_prompt?: string | null
  team_lead_name?: string
  team_lead_prompt?: string
  model?: string
  generation_options?: Record<string, unknown> | null
}

export async function createWorkspace(body: CreateWorkspaceInput): Promise<WorkspaceSnapshot> {
  return ouroFetchJson<WorkspaceSnapshot>("/api/workspaces", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

/** Post a message to #general for the workspace (team lead + channel see it). */
export async function postMessageToGeneralChannel(
  workspaceSlug: string,
  body: string,
): Promise<void> {
  const manifest = await getWorkspaceManifest(workspaceSlug)
  const channel = findGeneralChannel(manifest)
  if (!channel) {
    throw new Error("Workspace has no #general channel yet.")
  }
  await postChannelMessageDirect({ manifest, channel, body })
}
