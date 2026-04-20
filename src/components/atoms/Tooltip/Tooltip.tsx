"use client"

import { Tooltip as TooltipParts } from "@base-ui/react/tooltip"

import * as S from "./styles"

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipParts.Provider.Props) {
  return (
    <TooltipParts.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipParts.Root.Props) {
  return <TooltipParts.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipParts.Trigger.Props) {
  return <TooltipParts.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipParts.Popup.Props &
  Pick<
    TooltipParts.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipParts.Portal>
      <S.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <S.Popup
          data-slot="tooltip-content"
          className={className}
          {...props}
        >
          {children}
          <S.Arrow />
        </S.Popup>
      </S.Positioner>
    </TooltipParts.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
