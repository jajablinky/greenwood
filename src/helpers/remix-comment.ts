export type ParsedRemixComment =
  | { isRemix: false; bodyText: string }
  | {
      isRemix: true
      /** Fork label from `Remix:AppName|…`; omit when user only sent `Remix: prompt`. */
      forkAppName: string | null
      promptSlice: string
      bodyText: string
    }

/**
 * `Remix: …` — user-submitted idea (legacy): rest is the prompt.
 * `Remix:ForkApp|prompt text` — optional fork name + prompt (mock / structured).
 */
export function parseRemixComment(body: string): ParsedRemixComment {
  if (!body.startsWith("Remix:")) {
    return { isRemix: false, bodyText: body }
  }
  const rest = body.slice("Remix:".length).trim()
  const pipe = rest.indexOf("|")
  if (pipe !== -1) {
    const appPart = rest.slice(0, pipe).trim()
    const prompt = rest.slice(pipe + 1).trim()
    return {
      isRemix: true,
      forkAppName: appPart.length > 0 ? appPart : null,
      promptSlice: prompt,
      bodyText: prompt,
    }
  }
  return {
    isRemix: true,
    forkAppName: null,
    promptSlice: rest,
    bodyText: rest,
  }
}

export function isRemixCommentBody(body: string): boolean {
  return parseRemixComment(body).isRemix
}

/** Truncate for one-line / excerpt display. */
export function slicePrompt(text: string, maxChars: number): string {
  const t = text.trim()
  if (t.length <= maxChars) return t
  return `${t.slice(0, Math.max(0, maxChars - 1)).trim()}…`
}
