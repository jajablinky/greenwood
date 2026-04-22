import { useId, useState } from "react"

import type { MockTraceEntry } from "helpers/mock-agent-trace"

import * as S from "./styles"

type Props = {
  entries: MockTraceEntry[]
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

export function MockAgentTraceList({ entries }: Props) {
  return (
    <S.MockAgentTraceStream>
      {entries.map((entry, i) => {
        const key = `${entry.kind}-${i}`
        switch (entry.kind) {
          case "user_line":
            return (
              <S.MockAgentUserLine key={key}>{entry.text}</S.MockAgentUserLine>
            )
          case "thought_elapsed":
            return (
              <S.MockAgentThoughtElapsed key={key}>
                {entry.text}
              </S.MockAgentThoughtElapsed>
            )
          case "line":
            return <S.MockAgentTraceLine key={key}>{entry.text}</S.MockAgentTraceLine>
          case "command":
            return (
              <S.MockAgentCommandBlock key={key}>
                <code>{entry.text}</code>
              </S.MockAgentCommandBlock>
            )
          case "explore_block":
            return (
              <MockExploreBlockRow
                key={key}
                reactKey={key}
                fileCount={entry.fileCount}
                searchCount={entry.searchCount}
                items={entry.items}
              />
            )
          case "diff":
            return (
              <S.MockAgentDiffWrap key={key}>
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
      })}
    </S.MockAgentTraceStream>
  )
}
