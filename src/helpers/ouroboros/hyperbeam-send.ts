/**
 * Minimal HyperBEAM channel post — vendored from ouroboros/src/web/src/hyperbeam.ts
 * (postChannelMessageDirect + dependencies).
 */
import type {
  WorkspaceManifest,
  WorkspaceManifestChannel,
} from "helpers/ouroboros/types"
import { base64urlEncode, type DataItemTag } from "helpers/ouroboros/vendor/dataitem"
import { createSignedWalletDataItem } from "helpers/ouroboros/vendor/wallet-extension"

const encoder = new TextEncoder()

async function encryptForRecipient(
  recipientPublicKeyN: string,
  plaintext: string,
): Promise<{ encryptedKey: string; iv: string; ciphertext: string; tag: string }> {
  const aesKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoder.encode(plaintext),
  )
  const ciphertextBytes = new Uint8Array(ciphertextBuffer)
  const tag = ciphertextBytes.slice(-16)
  const ciphertext = ciphertextBytes.slice(0, -16)
  const exportedAesKey = new Uint8Array(await crypto.subtle.exportKey("raw", aesKey))
  const encodedAesKey = encoder.encode(base64urlEncode(exportedAesKey))
  const recipientKey = await crypto.subtle.importKey(
    "jwk",
    { kty: "RSA", n: recipientPublicKeyN, e: "AQAB", ext: true, key_ops: ["encrypt"] },
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  )
  const encryptedKey = new Uint8Array(
    await crypto.subtle.encrypt({ name: "RSA-OAEP" }, recipientKey, encodedAesKey),
  )
  return {
    encryptedKey: base64urlEncode(encryptedKey),
    iv: base64urlEncode(iv),
    ciphertext: base64urlEncode(ciphertext),
    tag: base64urlEncode(tag),
  }
}

function lowerTags(tags: Record<string, string | null | undefined>): DataItemTag[] {
  return Object.entries(tags)
    .filter(([, value]) => typeof value === "string" && value.length > 0)
    .map(([name, value]) => ({ name: name.toLowerCase(), value: value! }))
}

function messageTags(extra: DataItemTag[] = []): DataItemTag[] {
  return [
    { name: "data-protocol", value: "ao" },
    { name: "type", value: "Message" },
    { name: "variant", value: "ao.N.1" },
    ...extra,
  ]
}

function schedulerPostUrl(hbUrl: string): string {
  const base = hbUrl.endsWith("/") ? hbUrl.slice(0, -1) : hbUrl
  return `${base}/~scheduler@1.0/schedule`
}

type PostScheduleMessageInput = {
  hbUrl: string
  processId: string
  body: string
  recipientPublicKey: string
  tags: Record<string, string | null | undefined>
}

async function postSignedScheduleMessage(input: PostScheduleMessageInput): Promise<{
  processId: string
  id: string | null
  slot: number | null
}> {
  const encrypted = await encryptForRecipient(input.recipientPublicKey, input.body)
  const dataItem = await createSignedWalletDataItem(
    encrypted.ciphertext,
    messageTags([
      { name: "target", value: input.processId },
      ...lowerTags(input.tags),
      { name: "encrypted", value: "true" },
      { name: "encrypted-key", value: encrypted.encryptedKey },
      { name: "encrypted-iv", value: encrypted.iv },
      { name: "encrypted-tag", value: encrypted.tag },
    ]),
  )
  const payload = new Uint8Array(dataItem).buffer
  const response = await fetch(schedulerPostUrl(input.hbUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "codec-device": "ans104@1.0",
    },
    body: payload,
  })
  if (!response.ok) {
    throw new Error((await response.text()) || `HyperBEAM post failed: ${response.status}`)
  }
  return {
    processId: input.processId,
    id: response.headers.get("id") ?? response.headers.get("assignment") ?? null,
    slot: Number(response.headers.get("slot") ?? NaN) || null,
  }
}

function requireProcessId(kind: string, target: { processId: string | null }): string {
  if (!target.processId) {
    throw new Error(`${kind} does not yet have a HyperBEAM process.`)
  }
  return target.processId
}

function requirePublicKey(kind: string, target: { publicKey?: string | null }): string {
  if (!target.publicKey) {
    throw new Error(`${kind} does not expose a usable public key.`)
  }
  return target.publicKey
}

function requireSelf(
  manifest: WorkspaceManifest,
): WorkspaceManifest["self"] & { processId: string; publicKey: string } {
  if (!manifest.self?.processId || !manifest.self.publicKey) {
    throw new Error("Connect your wallet and wait for HyperBEAM identity before messaging.")
  }
  return manifest.self as WorkspaceManifest["self"] & { processId: string; publicKey: string }
}

function selfAuthorAddress(
  self: WorkspaceManifest["self"] & { processId: string; publicKey: string },
): string {
  return self.address ?? self.id
}

export type PostedScheduleMessage = {
  processId: string
  id: string | null
  slot: number | null
  correlationId?: string | null
}

/** Post a user message to #general (or another channel) via HyperBEAM. */
export async function postChannelMessageDirect(input: {
  manifest: WorkspaceManifest
  channel: WorkspaceManifestChannel
  body: string
  correlationId?: string | null
}): Promise<PostedScheduleMessage> {
  const self = requireSelf(input.manifest)
  const channelProcessId = requireProcessId(`Channel #${input.channel.slug}`, input.channel)
  const nodePublicKey = requirePublicKey("HyperBEAM node", { publicKey: input.manifest.nodePublicKey })

  const posted = await postSignedScheduleMessage({
    hbUrl: input.manifest.hbUrl,
    processId: channelProcessId,
    body: input.body,
    recipientPublicKey: nodePublicKey,
    tags: {
      kind: "channel",
      workspace: input.manifest.workspaceSlug,
      channel: channelProcessId,
      "author-kind": "user",
      "author-address": selfAuthorAddress(self),
      ...(self.processId ? { "author-process": self.processId } : {}),
      ...(input.correlationId ? { correlation: input.correlationId } : {}),
      ...(input.correlationId ? { "client-id": input.correlationId } : {}),
    },
  })
  return {
    ...posted,
    correlationId: input.correlationId ?? null,
  }
}

export function findGeneralChannel(manifest: WorkspaceManifest): WorkspaceManifestChannel | null {
  return manifest.channels.find((c) => c.slug === "general") ?? null
}
