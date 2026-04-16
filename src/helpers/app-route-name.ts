/** Slug used in `/studio/:appName` routes. */
export function toAppRouteName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function studioPathForProtocol(name: string): string {
  return `/studio/${toAppRouteName(name)}`
}

/** Route for the feed app detail page. */
export function activityDetailPath(feedId: string): string {
  return `/app/${encodeURIComponent(feedId)}`
}
