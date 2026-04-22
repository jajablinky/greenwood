import { toAppRouteName } from "helpers/app-route-name"
import type { Workspace, WorkspaceSnapshot } from "helpers/ouroboros/types"

export type MockWorkspaceOptions = {
  description?: string | null
}

/** Local-only workspace row for demos when `APP_MOCK_ONLY` is on (no API). */
export function mockWorkspaceSnapshotFromName(
  name: string,
  options?: MockWorkspaceOptions,
): WorkspaceSnapshot {
  const trimmed = name.trim()
  const slug = toAppRouteName(trimmed) || "project"
  const id = `mock-${slug}-${Date.now().toString(36)}`
  const now = new Date().toISOString()
  const workspace: Workspace = {
    id,
    name: trimmed || "Untitled project",
    slug,
    folder_path: "/mock",
    description:
      options?.description?.trim() ??
      "Local preview — connect a backend to enable live workspaces.",
    status: "idle",
    model: "mock",
    system_prompt: "",
    created_at: now,
  }
  return {
    workspace,
    members: [],
    channels: [],
    dashboards: [],
    workspace_users: [],
    channel_members: {},
    channel_users: {},
  }
}
