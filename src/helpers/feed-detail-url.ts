/** Absolute URL for a hash-router app detail path, e.g. `/app/feed-p-x` → `origin/#/app/feed-p-x`. */
export function feedDetailAbsoluteUrl(detailPath: string): string {
  const path = detailPath.replace(/^\//, "")
  return `${window.location.origin}/#/${path}`
}
