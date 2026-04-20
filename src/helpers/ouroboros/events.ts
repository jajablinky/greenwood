import { OUROBOROS_URL } from "helpers/config"
import type { OuroborosSseEventName } from "helpers/ouroboros/types"
import { buildAuthenticatedUrl } from "helpers/ouroboros/vendor/sign-http"

export type WorkspaceEventPayload = Record<string, unknown> & {
  workspace_id?: string
}

export type WorkspaceEventHandlers = Partial<{
  [K in OuroborosSseEventName]: (data: WorkspaceEventPayload) => void
}>

const SSE_EVENT_NAMES: OuroborosSseEventName[] = [
  "workspace.updated",
  "message.created",
  "member.updated",
  "activity.created",
  "thought.delta",
]

/**
 * Subscribe to `/api/workspaces/:slug/events` with ANS-104 auth query param.
 * Reconnects with exponential backoff on error/close.
 */
export function subscribeWorkspaceEvents(
  workspaceSlug: string,
  handlers: WorkspaceEventHandlers,
  options?: { maxReconnectAttempts?: number },
): () => void {
  const maxAttempts = options?.maxReconnectAttempts ?? 12
  let cancelled = false
  let es: EventSource | null = null
  let attempt = 0
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  const path = `/api/workspaces/${encodeURIComponent(workspaceSlug)}/events`
  const absoluteBase = `${OUROBOROS_URL.replace(/\/+$/, "")}${path}`

  function clearReconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  async function open() {
    if (cancelled) return
    es?.close()
    try {
      const url = await buildAuthenticatedUrl(path, {
        method: "GET",
        baseUrl: absoluteBase,
      })
      if (cancelled) return
      es = new EventSource(url)
      attempt = 0

      for (const name of SSE_EVENT_NAMES) {
        const handler = handlers[name]
        if (!handler) continue
        es.addEventListener(name, (ev) => {
          try {
            const data = JSON.parse((ev as MessageEvent).data as string) as WorkspaceEventPayload
            handler(data)
          } catch {
            // ignore malformed
          }
        })
      }

      es.onerror = () => {
        es?.close()
        es = null
        if (cancelled) return
        attempt += 1
        if (attempt > maxAttempts) return
        const delay = Math.min(30_000, 500 * 2 ** Math.min(attempt, 8))
        reconnectTimer = setTimeout(() => void open(), delay)
      }
    } catch {
      if (cancelled) return
      attempt += 1
      const delay = Math.min(30_000, 500 * 2 ** Math.min(attempt, 8))
      reconnectTimer = setTimeout(() => void open(), delay)
    }
  }

  void open()

  return () => {
    cancelled = true
    clearReconnect()
    es?.close()
    es = null
  }
}
