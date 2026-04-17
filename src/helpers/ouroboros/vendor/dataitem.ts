/**
 * Vendored from ouroboros/src/web/src/dataitem.ts (browser ANS-104 helpers).
 * Re-sync when upgrading Ouroboros.
 */
/**
 * ANS-104 Data Item creation and signing for browser-side request authentication.
 *
 * Implements the binary data item format per ANS-104 specification:
 * https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md
 *
 * Used as a replacement for session cookies + CSRF tokens: each API request
 * is accompanied by a signed data item whose tags encode the request method,
 * path, timestamp, and body hash.
 *
 * Dependency-free — uses only browser SubtleCrypto.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Signature type 1 = Arweave RSA-4096 (sig 512 bytes, owner 512 bytes). */
const SIG_TYPE = 1
const SIG_LENGTH = 512
const OWNER_LENGTH = 512

// ---------------------------------------------------------------------------
// Tag type
// ---------------------------------------------------------------------------

export type DataItemTag = { name: string; value: string }

// ---------------------------------------------------------------------------
// Avro tag serialization (ANS-104 § 1.3)
// ---------------------------------------------------------------------------

function avroLong(n: number): Uint8Array {
  const buf: number[] = []
  let m = n >= 0 ? n << 1 : (~n << 1) | 1
  do {
    buf.push(m & 0x7f)
    m >>>= 7
    if (m) buf[buf.length - 1] |= 0x80
  } while (m)
  return new Uint8Array(buf)
}

function avroString(s: string): Uint8Array {
  const encoded = new TextEncoder().encode(s)
  const len = avroLong(encoded.length)
  const out = new Uint8Array(len.length + encoded.length)
  out.set(len, 0)
  out.set(encoded, len.length)
  return out
}

export function serializeTags(tags: DataItemTag[]): Uint8Array {
  if (tags.length === 0) return new Uint8Array([0])
  const parts: Uint8Array[] = []
  parts.push(avroLong(tags.length))
  for (const tag of tags) {
    parts.push(avroString(tag.name))
    parts.push(avroString(tag.value))
  }
  parts.push(avroLong(0)) // block terminator
  let totalLen = 0
  for (const p of parts) totalLen += p.length
  const out = new Uint8Array(totalLen)
  let offset = 0
  for (const p of parts) {
    out.set(p, offset)
    offset += p.length
  }
  return out
}

// ---------------------------------------------------------------------------
// Deep hash (SHA-384, matching Arweave spec)
// ---------------------------------------------------------------------------

type DeepHashChunk = Uint8Array | DeepHashChunk[]

function concat(...arrays: Uint8Array[]): Uint8Array {
  let totalLen = 0
  for (const a of arrays) totalLen += a.length
  const out = new Uint8Array(totalLen)
  let offset = 0
  for (const a of arrays) {
    out.set(a, offset)
    offset += a.length
  }
  return out
}

function stringToBuffer(s: string): Uint8Array {
  return new TextEncoder().encode(s)
}

/** Convert Uint8Array to a plain ArrayBuffer that SubtleCrypto accepts. */
function toArrayBuffer(u: Uint8Array): ArrayBuffer {
  return u.buffer instanceof ArrayBuffer
    ? u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength)
    : (new Uint8Array(u).buffer as ArrayBuffer)
}

async function sha384(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-384", toArrayBuffer(data))
  return new Uint8Array(digest)
}

export async function deepHash(data: DeepHashChunk): Promise<Uint8Array> {
  if (data instanceof Uint8Array) {
    const tag = concat(
      stringToBuffer("blob"),
      stringToBuffer(data.byteLength.toString()),
    )
    const taggedHash = concat(await sha384(tag), await sha384(data))
    return sha384(taggedHash)
  }
  const tag = concat(stringToBuffer("list"), stringToBuffer(data.length.toString()))
  let acc = await sha384(tag)
  for (const chunk of data) {
    const chunkHash = await deepHash(chunk)
    acc = await sha384(concat(acc, chunkHash))
  }
  return acc
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shortTo2ByteArray(n: number): Uint8Array {
  return new Uint8Array([n & 0xff, (n >> 8) & 0xff])
}

function longTo8ByteArray(n: number): Uint8Array {
  const buf = new Uint8Array(8)
  for (let i = 0; i < 8; i++) {
    buf[i] = n & 0xff
    n = Math.floor(n / 256)
  }
  return buf
}

export function base64urlEncode(buf: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]!)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function base64urlDecode(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(padded)
  const buf = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i)
  return buf
}

// ---------------------------------------------------------------------------
// Data item creation
// ---------------------------------------------------------------------------

export interface CreateDataItemOptions {
  tags?: DataItemTag[]
  target?: string // base64url Arweave address (32 bytes)
  anchor?: Uint8Array // 32 random bytes (replay protection)
  data?: Uint8Array // body data
}

/**
 * Build the binary data item buffer with a placeholder signature.
 */
function buildDataItemBuffer(ownerBytes: Uint8Array, options: CreateDataItemOptions) {
  const _target = options.target ? base64urlDecode(options.target) : null
  const targetLength = 1 + (_target ? 32 : 0)
  const _anchor = options.anchor ?? null
  const anchorLength = 1 + (_anchor ? 32 : 0)
  const serializedTags =
    options.tags && options.tags.length > 0 ? serializeTags(options.tags) : null
  const tagsLength = 16 + (serializedTags ? serializedTags.byteLength : 0)
  const _data = options.data ?? new Uint8Array(0)
  const dataLength = _data.byteLength

  const totalLength =
    2 + SIG_LENGTH + OWNER_LENGTH + targetLength + anchorLength + tagsLength + dataLength
  const bytes = new Uint8Array(totalLength)

  let pos = 0
  bytes.set(shortTo2ByteArray(SIG_TYPE), pos)
  pos += 2
  pos += SIG_LENGTH // signature placeholder
  bytes.set(ownerBytes, pos)
  pos += OWNER_LENGTH
  bytes[pos] = _target ? 1 : 0
  pos += 1
  if (_target) {
    bytes.set(_target, pos)
    pos += 32
  }
  bytes[pos] = _anchor ? 1 : 0
  pos += 1
  if (_anchor) {
    bytes.set(_anchor, pos)
    pos += 32
  }
  bytes.set(longTo8ByteArray(options.tags?.length ?? 0), pos)
  pos += 8
  bytes.set(longTo8ByteArray(serializedTags?.byteLength ?? 0), pos)
  pos += 8
  if (serializedTags) {
    bytes.set(serializedTags, pos)
    pos += serializedTags.byteLength
  }
  bytes.set(_data, pos)

  return {
    bytes,
    signatureOffset: 2,
    rawTarget: _target ?? new Uint8Array(0),
    rawAnchor: _anchor ?? new Uint8Array(0),
    rawTags: serializedTags ?? new Uint8Array(0),
    rawData: _data,
    ownerBytes,
  }
}

async function getSignatureData(
  ownerBytes: Uint8Array,
  rawTarget: Uint8Array,
  rawAnchor: Uint8Array,
  rawTags: Uint8Array,
  rawData: Uint8Array,
): Promise<Uint8Array> {
  return deepHash([
    stringToBuffer("dataitem"),
    stringToBuffer("1"),
    stringToBuffer(SIG_TYPE.toString()),
    ownerBytes,
    rawTarget,
    rawAnchor,
    rawTags,
    rawData,
  ])
}

// ---------------------------------------------------------------------------
// Signing with a local JWK (SubtleCrypto RSA-PSS SHA-256)
// ---------------------------------------------------------------------------

async function signWithJwk(jwk: JsonWebKey, data: Uint8Array): Promise<Uint8Array> {
  const { key_ops, alg, ext, ...pssJwk } = jwk as Record<string, unknown>
  void key_ops
  void alg
  void ext
  const key = await crypto.subtle.importKey(
    "jwk",
    pssJwk as JsonWebKey,
    { name: "RSA-PSS", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign(
    { name: "RSA-PSS", saltLength: 32 },
    key,
    toArrayBuffer(data),
  )
  return new Uint8Array(sig)
}

export async function createSignedDataItem(
  jwk: JsonWebKey,
  options: CreateDataItemOptions,
): Promise<Uint8Array> {
  return createSignedDataItemWithSigner(jwk.n!, (sigData) => signWithJwk(jwk, sigData), options)
}

export async function createSignedDataItemWithSigner(
  ownerPublicKeyN: string,
  signer: (signatureData: Uint8Array) => Promise<Uint8Array>,
  options: CreateDataItemOptions,
): Promise<Uint8Array> {
  const ownerBytes = base64urlDecode(ownerPublicKeyN)
  if (ownerBytes.length !== OWNER_LENGTH) {
    throw new Error(`Owner key must be ${OWNER_LENGTH} bytes, got ${ownerBytes.length}`)
  }
  const item = buildDataItemBuffer(ownerBytes, options)
  const sigData = await getSignatureData(
    item.ownerBytes,
    item.rawTarget,
    item.rawAnchor,
    item.rawTags,
    item.rawData,
  )
  const signature = await signer(sigData)
  if (signature.byteLength !== SIG_LENGTH) {
    throw new Error(`Signature must be ${SIG_LENGTH} bytes, got ${signature.byteLength}`)
  }
  item.bytes.set(signature, item.signatureOffset)
  return item.bytes
}

// ---------------------------------------------------------------------------
// Request signing helpers
// ---------------------------------------------------------------------------

export async function signRequest(
  jwk: JsonWebKey,
  method: string,
  path: string,
  body?: string | Uint8Array | null,
): Promise<string> {
  const bodyBytes = body
    ? typeof body === "string"
      ? new TextEncoder().encode(body)
      : body
    : new Uint8Array(0)
  const bodyHashBuf = await crypto.subtle.digest("SHA-256", toArrayBuffer(bodyBytes))
  const bodyHash = base64urlEncode(new Uint8Array(bodyHashBuf))
  const anchor = new Uint8Array(32)
  crypto.getRandomValues(anchor)
  const tags: DataItemTag[] = [
    { name: "Method", value: method },
    { name: "Path", value: path },
    { name: "Timestamp", value: Date.now().toString() },
    { name: "Body-Hash", value: bodyHash },
  ]
  const item = await createSignedDataItem(jwk, { tags, anchor, data: bodyBytes })
  return base64urlEncode(item)
}
