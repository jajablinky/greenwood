/**
 * JSON shapes returned by Ouroboros HTTP handlers.
 * Kept in sync with `decorate*` helpers in `src/server/server.ts` (legacy path: `src/web/src/api.ts`).
 */

export type GenerationOptionValue = string | number | boolean

export type GenerationOptions = Record<string, GenerationOptionValue>

export type Preferences = {
  theme: string
  output_style: string
  channel_indicators: string
  channel_indicator_overrides: Record<string, string>
  push_notifications_enabled: boolean
  muted_channels: string[]
  muted_threads: string[]
}

export type AuthState = {
  authenticated: boolean
  username?: string
  role?: string
  theme?: string
  preferences?: Preferences
  arweaveAddress?: string
  arweavePublicKey?: string | null
  processId?: string | null
  hbUrl?: string
  hbNodeAddress?: string | null
  schedulerUrl?: string | null
  features?: {
    defaultModel?: string | null
    defaultSharedHostRoot?: string | null
  }
}

export type PublishedPort = {
  host_port: number
  container_port: number
}

export type Workspace = {
  id: string
  name: string
  slug: string
  folder_path: string | null
  description: string | null
  status: string
  model: string
  system_prompt: string
  shared_host_dir?: string | null
  docker_host_access?: boolean
  published_ports?: PublishedPort[] | null
  program_path?: string | null
  schedule?: string | null
  schedule_overlap?: string
  schedule_mode?: string
  generation_options?: GenerationOptions | null
  /** Optional bash timeouts exposed by the workspace API (metadata-backed). */
  bash_timeout_default_ms?: number
  bash_timeout_max_ms?: number
  can_manage?: boolean
  unread_count?: number
  created_at: string
}

export type WorkspaceUser = {
  username: string
  role: "admin" | "user"
  workspace_role: "owner" | "member"
  arweave_address: string
  arweave_public_key?: string | null
  process_id?: string | null
  scheduler_url?: string | null
}

export type WorkspaceManifestParticipant = {
  id: string
  address?: string | null
  processId: string | null
  publicKey?: string | null
  schedulerUrl?: string | null
}

export type WorkspaceManifestMember = WorkspaceManifestParticipant & {
  name: string
  slug: string
}

export type WorkspaceManifestChannel = WorkspaceManifestParticipant & {
  name: string
  slug: string
}

export type WorkspaceManifestUser = WorkspaceManifestParticipant & {
  address: string
  username: string
}

export type WorkspaceManifest = {
  hbUrl: string
  nodeAddress?: string | null
  workspaceSlug: string
  nodePublicKey: string | null
  self: WorkspaceManifestUser | null
  members: WorkspaceManifestMember[]
  channels: WorkspaceManifestChannel[]
  users: WorkspaceManifestUser[]
}

export type Member = {
  id: string
  name: string
  slug: string
  role: "team_lead" | "member"
  status: string
  model: string
  home_dir: string
  system_prompt: string
  identity_prompt?: string | null
  allow_network?: boolean
  receive_wait?: Record<string, unknown> | null
  tools: string[]
  schedule?: string | null
  schedule_overlap?: string
  schedule_mode?: string
  generation_options?: GenerationOptions | null
  effective_generation_options?: GenerationOptions | null
}

export type Channel = {
  id: string
  name: string
  slug: string
  kind: string
  topic: string | null
  created_by_member_id?: string | null
}

export type Dashboard = {
  id: string
  slug: string
  name: string
  container_entry_path: string
  public: boolean
  updated_at: string | null
  url: string
  public_url?: string | null
}

export type UnreadCounts = {
  workspace_total: number
  channels: Record<string, number>
  directs: Record<string, number>
  threads: Record<string, number>
}

export type WorkspaceSnapshot = {
  workspace: Workspace
  members: Member[]
  channels: Channel[]
  dashboards: Dashboard[]
  workspace_users: WorkspaceUser[]
  channel_members: Record<string, string[]>
  channel_users: Record<string, string[]>
  unread_counts?: UnreadCounts
}

export type Folder = {
  path: string
  name: string
  parent_path: string | null
}

export type ThoughtEntry = {
  id: string
  member_id: string
  kind: string
  body: string
  metadata?: Record<string, unknown> | null
  created_at: string
}

/** Ouroboros runtime SSE event names (see ouroboros/src/runtime/events.ts). */
export type OuroborosSseEventName =
  | "workspace.updated"
  | "message.created"
  | "member.updated"
  | "activity.created"
  | "thought.delta"
