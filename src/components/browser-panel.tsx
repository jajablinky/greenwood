"use client"

import {
  AppWindowIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCwIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type BrowserPanelProps = {
  className?: string
  onClose: () => void
}

export function BrowserPanel({ className, onClose }: BrowserPanelProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 min-w-0 flex-col border-l border-border/70 bg-[#f3f3f3] dark:bg-muted/40",
        className
      )}
    >
      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border/60 bg-background px-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-lg"
          aria-label="Back"
          disabled
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-lg"
          aria-label="Forward"
          disabled
        >
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 rounded-lg" aria-label="Refresh" disabled>
          <RotateCwIcon className="size-4" />
        </Button>
        <Input
          readOnly
          placeholder="Search or enter URL…"
          className="mx-1 h-8 min-w-0 flex-1 rounded-lg border-border/60 bg-muted/40 text-sm shadow-none"
          aria-label="Address bar (preview)"
        />
        <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 rounded-lg" aria-label="Open window" disabled>
          <AppWindowIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-lg"
          aria-label="Close browser panel"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-[#ececec] dark:bg-muted/30" />
        <div
          className="pointer-events-none absolute right-3 bottom-3 h-24 w-36 rounded-md border border-border/50 bg-background/80 shadow-sm dark:bg-background/60"
          aria-hidden
        />
      </div>
    </div>
  )
}
