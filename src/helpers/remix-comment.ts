export function isRemixCommentBody(body: string): boolean {
  return body.startsWith("Remix:")
}
