/** Hash-router path to a builder profile by comment author handle, e.g. `priya_shah`. */
export function profilePathForAuthor(author: string): string {
  return `/profile/${encodeURIComponent(author)}`
}
