import { useMemo, type ComponentPropsWithRef } from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "components/atoms/Tooltip"
import {
  contributionLevel,
  dateKeyFromMs,
  type ContributionData,
} from "helpers/profile-contribution-data"

import * as S from "./styles"

type Props = {
  data: ContributionData
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

const DAY_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" }

type DayCell = {
  col: number
  row: number
  level: 0 | 1 | 2 | 3 | 4
  count: number
  dateKey: string
  label: string
}

type MonthTick = { col: number; label: string }

function buildCells(data: ContributionData): {
  cells: DayCell[]
  months: MonthTick[]
  cols: number
} {
  const year = data.year
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)

  const leadingBlanks = start.getDay()
  const totalDays = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
  const cols = Math.ceil((leadingBlanks + totalDays) / 7)

  const cells: DayCell[] = []
  const months: MonthTick[] = []
  let lastMonth = -1

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(year, 0, 1 + i)
    const offset = i + leadingBlanks
    const col = Math.floor(offset / 7)
    const row = offset % 7
    const dateKey = dateKeyFromMs(d.getTime())
    const count = data.counts[dateKey] ?? 0
    const level = contributionLevel(count, data.max)
    const label = `${count} ${count === 1 ? "permaweb action" : "permaweb actions"} on ${d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`
    cells.push({ col, row, level, count, dateKey, label })

    const month = d.getMonth()
    if (month !== lastMonth && d.getDate() <= 7) {
      months.push({ col, label: MONTH_LABELS[month]! })
      lastMonth = month
    }
  }

  return { cells, months, cols }
}

function spanPropsFromGridTrigger(
  buttonProps: ComponentPropsWithRef<"button">,
): ComponentPropsWithRef<"span"> {
  const { type: _t, form: _f, name: _n, value: _v, children: _c, ...rest } = buttonProps
  return rest as ComponentPropsWithRef<"span">
}

export default function ContributionGraph({ data }: Props) {
  const { cells, months, cols } = useMemo(() => buildCells(data), [data])

  return (
    <S.Card aria-label={`${data.total} permaweb actions in ${data.year}`}>
      <S.Title>
        {data.total.toLocaleString()} permaweb actions in {data.year}
      </S.Title>
      <S.Scroller>
        <S.Layout $cols={cols}>
          <S.MonthRow aria-hidden>
            {months.map((m) => (
              <S.MonthLabel key={`${m.label}-${m.col}`} $col={m.col}>
                {m.label}
              </S.MonthLabel>
            ))}
          </S.MonthRow>
          <S.DayCol aria-hidden>
            {Object.entries(DAY_LABELS).map(([row, label]) => (
              <S.DayLabel key={label} $row={Number(row)}>
                {label}
              </S.DayLabel>
            ))}
          </S.DayCol>
          <S.Grid role="grid">
            {cells.map((cell) => (
              <Tooltip key={cell.dateKey}>
                <TooltipTrigger
                  delay={0}
                  closeDelay={0}
                  render={(_props) => {
                    const spanProps = spanPropsFromGridTrigger(_props)
                    return (
                      <S.Cell
                        {...spanProps}
                        $col={cell.col}
                        $row={cell.row}
                        $level={cell.level}
                        role="gridcell"
                        tabIndex={-1}
                        aria-label={cell.label}
                      />
                    )
                  }}
                />
                <TooltipContent side="top" sideOffset={6} align="center">
                  {cell.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </S.Grid>
        </S.Layout>
      </S.Scroller>
      <S.Legend aria-hidden>
        <span>Less</span>
        {([0, 1, 2, 3, 4] as const).map((lvl) => (
          <S.LegendSwatch key={lvl} $level={lvl} />
        ))}
        <span>More</span>
      </S.Legend>
    </S.Card>
  )
}
