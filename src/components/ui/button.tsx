import type { Button as ButtonPrimitive } from "@base-ui/react/button"

import { StyledButton, type BtnSize, type BtnVariant } from "./button.styles"

export type ButtonProps = ButtonPrimitive.Props & {
  variant?: BtnVariant
  size?: BtnSize
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      data-slot="button"
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    />
  )
}

export { Button }
