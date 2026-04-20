import * as S from "./styles"

const upPoints = "12 2.5 21.5 13.5 16.5 13.5 16.5 21.5 7.5 21.5 7.5 13.5 2.5 13.5"

const downPoints = "12 21.5 2.5 10.5 7.5 10.5 7.5 2.5 16.5 2.5 16.5 10.5 21.5 10.5"

const OUTLINE_STROKE = 1

type ArrowProps = {
  filled: boolean
  className?: string
}

export function VoteBlockArrowUp({ filled, className }: ArrowProps) {
  return (
    <S.Svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <polygon
        points={upPoints}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? undefined : OUTLINE_STROKE}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </S.Svg>
  )
}

export function VoteBlockArrowDown({ filled, className }: ArrowProps) {
  return (
    <S.Svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <polygon
        points={downPoints}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? undefined : OUTLINE_STROKE}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </S.Svg>
  )
}
