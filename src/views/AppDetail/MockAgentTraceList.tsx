import { useId, useState, type ReactNode } from "react"

import { Undo2Icon } from "assets/icons"
import type { MockTraceEntry } from "helpers/mock-agent-trace"

import * as S from "./styles"

type Props = {
  entries: MockTraceEntry[]
  /** Last visible entry index (inclusive). `null` = show entire trace. */
  visibleEndIndex?: number | null
  /** Set checkpoint — hides later trace entries (mock “revert to here”). */
  onRevertToIndex?: (index: number) => void
  /** Clear cutoff and show the full trace again. */
  onRestoreFullHistory?: () => void
}

function exploreSummaryLabel(fileCount: number, searchCount: number) {
  const files = fileCount === 1 ? "1 file" : `${fileCount} files`
  const searches = searchCount === 1 ? "1 search" : `${searchCount} searches`
  return `Explored ${files}, ${searches}`
}

function MockExploreBlockRow({
  fileCount,
  searchCount,
  items,
  reactKey,
}: {
  fileCount: number
  searchCount: number
  items: string[]
  reactKey: string
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const summary = exploreSummaryLabel(fileCount, searchCount)

  return (
    <S.MockExploreBlock>
      <S.MockExploreToggle
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <S.MockExploreSummary>{summary}</S.MockExploreSummary>
        <S.MockExploreChevron $open={open} aria-hidden>
          ›
        </S.MockExploreChevron>
      </S.MockExploreToggle>
      {open ? (
        <S.MockExplorePanel id={panelId} role="region" aria-label="Explored paths">
          {items.map((line, j) => (
            <S.MockExploreDetailLine key={`${reactKey}-ln-${j}`}>
              {line}
            </S.MockExploreDetailLine>
          ))}
        </S.MockExplorePanel>
      ) : null}
    </S.MockExploreBlock>
  )
}

function TraceEntryRow({
  index,
  visibleEndIndex,
  onRevert,
  showRevertControl,
  children,
}: {
  index: number
  visibleEndIndex: number | null
  onRevert?: (index: number) => void
  /** Revert checkpoint control — only on user prompts, not agent/tool output. */
  showRevertControl: boolean
  children: ReactNode
}) {
  const showRevert = onRevert != null && showRevertControl
  const isCutoff = visibleEndIndex !== null && visibleEndIndex === index

  return (
    <S.MockTraceRevertRow $activeCutoff={isCutoff} $alignCenter={showRevert}>
      <S.MockTraceRevertRowMain>{children}</S.MockTraceRevertRowMain>
      {showRevert ? (
        <S.MockTraceRevertIconButton
          type="button"
          title="Revert to this point in the conversation"
          aria-label={`Revert chat history to checkpoint after this message (${index + 1})`}
          onClick={() => onRevert?.(index)}
        >
          <Undo2Icon width={16} height={16} strokeWidth={2} aria-hidden />
        </S.MockTraceRevertIconButton>
      ) : null}
    </S.MockTraceRevertRow>
  )
}

function UserPromptGlyph({ ordinal }: { ordinal: number }) {
  if (ordinal === 0) {
    return (
      <S.UserInputGlyphGrid aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </S.UserInputGlyphGrid>
    )
  }
  return (
    <S.UserInputGlyphDot
      $tone={ordinal % 2 === 1 ? "accent" : "muted"}
      aria-hidden
    />
  )
}

function renderEntryInner(
  entry: MockTraceEntry,
  key: string,
  userLineOrdinal: number | null,
) {
  switch (entry.kind) {
    case "user_line":
      if (userLineOrdinal == null) {
        return null
      }
      return (
        <S.MockAgentUserInputRow
          $highlight={userLineOrdinal === 0}
          title={entry.text}
        >
          <UserPromptGlyph ordinal={userLineOrdinal} />
          <S.MockAgentUserInputText>{entry.text}</S.MockAgentUserInputText>
        </S.MockAgentUserInputRow>
      )
    case "thought_elapsed":
      return (
        <S.MockAgentThoughtElapsed>{entry.text}</S.MockAgentThoughtElapsed>
      )
    case "line":
      return <S.MockAgentTraceLine>{entry.text}</S.MockAgentTraceLine>
    case "command":
      return (
        <S.MockAgentCommandBlock>
          <code>{entry.text}</code>
        </S.MockAgentCommandBlock>
      )
    case "explore_block":
      return (
        <MockExploreBlockRow
          reactKey={key}
          fileCount={entry.fileCount}
          searchCount={entry.searchCount}
          items={entry.items}
        />
      )
    case "diff":
      return (
        <S.MockAgentDiffWrap>
          <S.MockAgentDiffHeader>
            <span>{entry.file}</span>
            <S.MockAgentDiffStats>
              <span>+{entry.additions}</span>
              <span>−{entry.deletions}</span>
            </S.MockAgentDiffStats>
          </S.MockAgentDiffHeader>
          <S.MockAgentDiffBody>
            {entry.lines.map((ln, j) => (
              <S.MockAgentDiffRow
                key={`${key}-ln-${j}`}
                $variant={ln.kind}
              >
                <S.MockAgentDiffRowPrefix aria-hidden>
                  {ln.kind === "add" ? "+" : ln.kind === "remove" ? "−" : " "}
                </S.MockAgentDiffRowPrefix>
                <span>{ln.text}</span>
              </S.MockAgentDiffRow>
            ))}
          </S.MockAgentDiffBody>
        </S.MockAgentDiffWrap>
      )
    default:
      return null
  }
}

/**
 * Mobile History drawer: only user prompts, dense timeline (separate from full trace in-page).
 */
export function MockAgentPromptTimeline({
  entries,
  visibleEndIndex = null,
  onRevertToIndex,
  onRestoreFullHistory,
}: Props) {
  const userRows: { traceIndex: number; text: string; ordinal: number }[] = []
  let ordinal = 0
  for (let i = 0; i < entries.length; i++) {
    if (visibleEndIndex !== null && i > visibleEndIndex) {
      break
    }
    const e = entries[i]
    if (e.kind === "user_line") {
      userRows.push({ traceIndex: i, text: e.text, ordinal: ordinal++ })
    }
  }

  const showBanner = truncatedView(
    visibleEndIndex,
    onRestoreFullHistory != null,
  )

  return (
    <S.MockPromptTimelineStream aria-label="Prompt timeline for this workspace">
      {showBanner ? (
        <S.ChatHistoryRevertBanner>
          <S.ChatHistoryRevertBannerText>
            Showing the conversation through this checkpoint. Later agent steps are
            hidden.
          </S.ChatHistoryRevertBannerText>
          <S.ChatHistoryRestoreFullButton
            type="button"
            onClick={onRestoreFullHistory}
          >
            Show full history
          </S.ChatHistoryRestoreFullButton>
        </S.ChatHistoryRevertBanner>
      ) : null}
      {userRows.map(({ traceIndex, text, ordinal: o }) => (
        <TraceEntryRow
          key={`timeline-user-${traceIndex}`}
          index={traceIndex}
          visibleEndIndex={visibleEndIndex}
          onRevert={onRevertToIndex}
          showRevertControl
        >
          <S.MockAgentUserInputRow $highlight={o === 0} title={text}>
            <UserPromptGlyph ordinal={o} />
            <S.MockAgentUserInputText>{text}</S.MockAgentUserInputText>
          </S.MockAgentUserInputRow>
        </TraceEntryRow>
      ))}
    </S.MockPromptTimelineStream>
  )
}

function truncatedView(
  visibleEndIndex: number | null | undefined,
  canRestore: boolean,
): boolean {
  return visibleEndIndex !== null && visibleEndIndex !== undefined && canRestore
}

export function MockAgentTraceList({
  entries,
  visibleEndIndex = null,
  onRevertToIndex,
  onRestoreFullHistory,
}: Props) {
  const truncated = visibleEndIndex !== null
  const showBanner = truncated && onRestoreFullHistory != null

  return (
    <S.MockAgentTraceStream>
      {showBanner ? (
        <S.ChatHistoryRevertBanner>
          <S.ChatHistoryRevertBannerText>
            Showing the conversation through this checkpoint. Later agent steps are
            hidden.
          </S.ChatHistoryRevertBannerText>
          <S.ChatHistoryRestoreFullButton
            type="button"
            onClick={onRestoreFullHistory}
          >
            Show full history
          </S.ChatHistoryRestoreFullButton>
        </S.ChatHistoryRevertBanner>
      ) : null}
      {entries.map((entry, i) => {
        if (visibleEndIndex !== null && i > visibleEndIndex) {
          return null
        }
        const key = `${entry.kind}-${i}`
        const userLineOrdinal =
          entry.kind === "user_line"
            ? entries.slice(0, i).filter((e) => e.kind === "user_line").length
            : null
        const inner = renderEntryInner(entry, key, userLineOrdinal)
        if (inner == null) {
          return null
        }

        return (
          <TraceEntryRow
            key={key}
            index={i}
            visibleEndIndex={visibleEndIndex}
            onRevert={onRevertToIndex}
            showRevertControl={entry.kind === "user_line"}
          >
            {inner}
          </TraceEntryRow>
        )
      })}
    </S.MockAgentTraceStream>
  )
}
