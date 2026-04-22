/** Structured entries for the mock-only agent trace panel (Cursor-style). */

export type MockDiffLine =
  | { kind: "add"; text: string }
  | { kind: "remove"; text: string }
  | { kind: "context"; text: string }

export type MockTraceEntry =
  | { kind: "user_line"; text: string }
  | { kind: "thought_elapsed"; text: string }
  | { kind: "line"; text: string }
  | {
      kind: "diff"
      file: string
      additions: number
      deletions: number
      lines: MockDiffLine[]
    }
  | { kind: "command"; text: string }
  /** Condensed file/search pass — summary row expands to show line items. */
  | {
      kind: "explore_block"
      fileCount: number
      searchCount: number
      items: string[]
    }
