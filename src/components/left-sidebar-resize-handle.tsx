"use client"

import * as React from "react"

import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type LeftSidebarResizeHandleProps = {
  widthPx: number
  minPx: number
  maxPx: number
  defaultWidthPx: number
  onWidthChange: (width: number) => void
}

export function LeftSidebarResizeHandle({
  widthPx,
  minPx,
  maxPx,
  defaultWidthPx,
  onWidthChange,
}: LeftSidebarResizeHandleProps) {
  const { state, isMobile } = useSidebar()
  const [dragging, setDragging] = React.useState(false)
  const startXRef = React.useRef(0)
  const startWidthRef = React.useRef(widthPx)

  if (isMobile || state === "collapsed") {
    return null
  }

  function clamp(w: number) {
    return Math.min(maxPx, Math.max(minPx, w))
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(true)
    startXRef.current = e.clientX
    startWidthRef.current = widthPx
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
      return
    }
    const delta = e.clientX - startXRef.current
    onWidthChange(clamp(startWidthRef.current + delta))
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setDragging(false)
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      className={cn(
        "pointer-events-auto absolute top-0 bottom-0 left-0 z-30 w-3 -translate-x-1/2 cursor-col-resize touch-none",
        dragging ? "bg-border/50" : "hover:bg-border/30"
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={() => setDragging(false)}
      onDoubleClick={() => onWidthChange(defaultWidthPx)}
    />
  )
}
