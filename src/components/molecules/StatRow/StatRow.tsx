import type { LucideIcon } from "lucide-react"
import * as React from "react"

import * as S from "./styles"

export const statRowListClassName = "flex flex-col gap-1.5"

export const statRowPaddingXClassName = "px-2 sm:px-3"
export const statRowPaddingYClassName = "py-3"

type StatRowListProps = {
  as?: "dl" | "ul"
  className?: string
} & Omit<React.HTMLAttributes<HTMLElement>, "as">

export function StatRowList({
  as = "dl",
  className,
  ...props
}: StatRowListProps) {
  if (as === "ul") {
    return <S.StatRowListUl className={className} {...props} />
  }
  return <S.StatRowListDl className={className} {...props} />
}

type StatRowProps = {
  as?: "div" | "li"
  striped?: boolean
  className?: string
} & Omit<React.HTMLAttributes<HTMLElement>, "as">

export function StatRow({
  as = "div",
  striped,
  className,
  ...props
}: StatRowProps) {
  if (as === "li") {
    return (
      <S.StatRowLi $striped={striped} className={className} {...props} />
    )
  }
  return <S.StatRowDiv $striped={striped} className={className} {...props} />
}

type StatRowIconLabelProps = {
  icon: LucideIcon
  children: React.ReactNode
  className?: string
}

export function StatRowIconLabel({
  icon: Icon,
  children,
  className,
}: StatRowIconLabelProps) {
  return (
    <S.StatRowDt className={className}>
      <S.IconSlot>
        <Icon
          style={{ width: "1rem", height: "1rem", flexShrink: 0, opacity: 0.6 }}
          strokeWidth={1.5}
          aria-hidden
        />
      </S.IconSlot>
      <S.LabelText>{children}</S.LabelText>
    </S.StatRowDt>
  )
}

type StatRowValueProps = {
  as?: "dd" | "div"
  children: React.ReactNode
  className?: string
} & Omit<React.HTMLAttributes<HTMLElement>, "as" | "children">

export function StatRowValue({
  as = "dd",
  className,
  children,
  ...props
}: StatRowValueProps) {
  if (as === "div") {
    return (
      <S.StatRowValueDiv className={className} {...props}>
        {children}
      </S.StatRowValueDiv>
    )
  }
  return (
    <S.StatRowDd className={className} {...props}>
      {children}
    </S.StatRowDd>
  )
}
