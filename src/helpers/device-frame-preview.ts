/** Search flag: app runs inside the phone-preview iframe (correct MQ viewport). */
export const DEVICE_FRAME_SEARCH_PARAM = "deviceFrame"

export function isDeviceFramePreview(): boolean {
  if (typeof window === "undefined") {
    return false
  }
  return new URLSearchParams(window.location.search).has(DEVICE_FRAME_SEARCH_PARAM)
}

/** Same-origin URL for the preview iframe; preserves hash for HashRouter. */
export function buildDeviceFramePreviewUrl(): string {
  const u = new URL(window.location.href)
  u.searchParams.set(DEVICE_FRAME_SEARCH_PARAM, "1")
  u.hash = window.location.hash
  return u.toString()
}
