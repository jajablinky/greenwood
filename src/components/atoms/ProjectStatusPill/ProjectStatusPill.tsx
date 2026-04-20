import clsx from "clsx"

import * as S from "./styles"

export type ProjectRunStatus =
  | "idle"
  | "starting"
  | "running"
  | "stuck"
  | "done"
  | "error"

const LABELS: Record<ProjectRunStatus, string> = {
  idle: "Ready",
  starting: "Starting…",
  running: "Working",
  stuck: "Stuck",
  done: "Done",
  error: "Error",
}

export function ProjectStatusPill({
  status,
  className,
}: {
  status: ProjectRunStatus
  className?: string
}) {
  return (
    <S.Pill
      className={clsx(className)}
      data-status={status}
      title={LABELS[status]}
    >
      {LABELS[status]}
    </S.Pill>
  )
}
