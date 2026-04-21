import type { MockTraceEntry } from "helpers/mock-agent-trace"

import * as S from "./styles"

type Props = {
  entries: MockTraceEntry[]
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
          case "review_footer":
            return (
              <S.MockAgentReviewRow key={key}>
                <S.MockAgentReviewBtn type="button">
                  Review{" "}
                  <S.MockAgentReviewStats>
                    +{entry.additions} −{entry.deletions}
                  </S.MockAgentReviewStats>
                </S.MockAgentReviewBtn>
                <S.MockAgentCommitSplit type="button">
                  Commit &amp; Push
                  <span aria-hidden>▾</span>
                </S.MockAgentCommitSplit>
              </S.MockAgentReviewRow>
            )
          default:
            return null
        }
      })}
    </S.MockAgentTraceStream>
  )
}
