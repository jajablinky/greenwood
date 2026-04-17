import { OUROBOROS_URL } from "helpers/config"
import { signHttpRequest } from "helpers/ouroboros/vendor/sign-http"

function joinBase(path: string): string {
  const base = OUROBOROS_URL.replace(/\/+$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Signed fetch to Ouroboros. `path` is pathname + optional query (e.g. `/api/workspaces?x=1`).
 */
export async function ouroFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = joinBase(path)
  const method = (init.method ?? "GET").toUpperCase()
  const headers = new Headers(init.headers ?? {})

  let bodyStr: string | null = null
  if (init.body !== undefined && init.body !== null) {
    if (typeof init.body === "string") {
      bodyStr = init.body
    } else if (init.body instanceof ArrayBuffer) {
      bodyStr = new TextDecoder().decode(init.body)
    } else if (init.body instanceof Blob) {
      bodyStr = await init.body.text()
    } else if (ArrayBuffer.isView(init.body)) {
      const v = init.body as ArrayBufferView
      bodyStr = new TextDecoder().decode(
        v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength),
      )
    }
  }

  const urlObj = new URL(url)
  const signPath = `${urlObj.pathname}${urlObj.search}`
  const token = await signHttpRequest(method, signPath, bodyStr)
  if (token) {
    headers.set("Authorization", `ANS-104 ${token}`)
  }

  if (
    init.body !== undefined &&
    init.body !== null &&
    !headers.has("Content-Type") &&
    !(init.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json")
  }

  return fetch(url, {
    ...init,
    method,
    headers,
    body: init.body,
  })
}

export async function ouroFetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await ouroFetch(path, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Ouroboros request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}
