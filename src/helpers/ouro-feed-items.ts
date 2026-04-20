import type { Workspace } from "helpers/ouroboros/types"
import type { GlobalFeedItem } from "helpers/activity-feed-mock-data"
import { mockEthereumAddressFromSeed } from "helpers/abbrev-wallet"

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Minimal preview for Ouroboros-backed projects. */
export function buildOuroWorkspacePreviewHtml(workspaceName: string): string {
  const t = escapeHtml(workspaceName)
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap"></head><body style="margin:0;font-family:DM Sans,sans-serif;background:linear-gradient(145deg,#0f172a,#1e293b);color:#e2e8f0;min-height:100%;display:flex;align-items:center;justify-content:center"><div style="text-align:center;padding:24px;max-width:280px"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;margin-bottom:8px">Ouroboros workspace</div><div style="font-size:18px;font-weight:600;line-height:1.25">${t}</div><div style="margin-top:14px;height:1px;background:rgba(148,163,184,.35)"></div><p style="margin:14px 0 0;font-size:12px;color:#94a3b8;line-height:1.45">Team lead agent is running in this workspace.</p></div></body></html>`
}

export function ouroFeedIdForSlug(slug: string): string {
  return `ouro:${slug}`
}

export function isOuroFeedId(feedId: string): boolean {
  return feedId.startsWith("ouro:")
}

export function workspaceSlugFromFeedId(feedId: string): string | null {
  if (!isOuroFeedId(feedId)) return null
  return feedId.slice("ouro:".length)
}

/** Build a feed row from an Ouroboros workspace record. */
export function globalFeedItemFromWorkspace(
  workspace: Workspace,
  options?: { score?: number },
): GlobalFeedItem {
  const slug = workspace.slug
  const id = ouroFeedIdForSlug(slug)
  const createdAt = workspace.created_at ? Date.parse(workspace.created_at) : Date.now()
  const builderWallet = mockEthereumAddressFromSeed(slug)
  return {
    id,
    appSlug: slug,
    appName: workspace.name,
    cardTitle: workspace.name,
    forkId: `ouro-${slug}`,
    transactionId: workspace.id.slice(0, 12),
    detail: workspace.description?.trim() || "Ouroboros workspace — team lead orchestrates builds.",
    builder: "you",
    builderInitials: "YO",
    builderWallet,
    createdAt,
    score: options?.score ?? 0,
    previewHtml: buildOuroWorkspacePreviewHtml(workspace.name),
    previewHoverAccent: "rgba(56, 189, 248, 0.35)",
    tokenPrice: "—",
    priceChangePct: "—",
    marketCapLabel: "—",
    initialComments: [],
  }
}

export function remixDescription(parentSlug: string): string {
  return `remix_of:${parentSlug}`
}

export function remixTeamLeadPrompt(parentTitle: string, userPrompt: string): string {
  return `Remix of "${parentTitle}": ${userPrompt}`
}
