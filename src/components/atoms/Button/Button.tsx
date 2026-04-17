import type { Button as ButtonPrimitive } from "@base-ui/react/button"

import {
  StyledButton,
  type BtnSize,
  type BtnVariant,
  type BtnVoteDirection,
} from "./styles"

type ButtonPropsBase = ButtonPrimitive.Props & {
  size?: BtnSize
}

export type ButtonProps =
  | (ButtonPropsBase & {
      variant?: Exclude<BtnVariant, "vote">
      voteDirection?: undefined
    })
  | (ButtonPropsBase & {
      variant: "vote"
      voteDirection: BtnVoteDirection
    })

function Button({
  className,
  variant = "default",
  size = "default",
  voteDirection,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      data-slot="button"
      $variant={variant}
      $size={size}
      $voteDirection={variant === "vote" ? voteDirection : undefined}
      className={className}
      {...props}
    />
  )
}

export type { BtnVoteDirection }
export { Button }
