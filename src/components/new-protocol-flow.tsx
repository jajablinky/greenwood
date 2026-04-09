import * as React from "react"
import { CornerDownLeftIcon, MicIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type NewProtocolFlowProps = {
  plan: string
  onPlanChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onDismiss: () => void
  className?: string
}

export function NewProtocolFlow({
  plan,
  onPlanChange,
  onSubmit,
  onDismiss,
  className,
}: NewProtocolFlowProps) {
  const planRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    planRef.current?.focus()
  }, [])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onDismiss()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onDismiss])

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto",
        className
      )}
    >
      <form
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-5 py-12 sm:px-8 sm:py-14"
        onSubmit={onSubmit}
      >
        <div className="flex min-h-[240px] flex-col rounded-xl border border-black/[0.08] bg-white shadow-sm dark:border-white/[0.12] dark:bg-card">
          <label htmlFor="new-protocol-plan" className="sr-only">
            Plan and build
          </label>
          <textarea
            ref={planRef}
            id="new-protocol-plan"
            value={plan}
            onChange={(e) => onPlanChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                e.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="Plan, Build, / for commands, @ for context"
            rows={6}
            className="min-h-[160px] w-full flex-1 resize-none rounded-t-xl border-0 bg-transparent px-5 py-5 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 sm:px-6 sm:py-6"
          />
          <div className="flex items-center justify-between gap-3 border-t border-black/[0.06] px-4 py-3 dark:border-white/[0.08] sm:px-5 sm:py-3.5">
            <div className="flex min-w-0 items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-9 shrink-0 rounded-full text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/10"
                aria-label="Add context"
              >
                <PlusIcon className="size-4" />
              </Button>
              <Select defaultValue="auto">
                <SelectTrigger
                  size="sm"
                  className="h-9 max-w-[7.5rem] rounded-full border-0 bg-muted/60 shadow-none dark:bg-muted/40"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="careful">Careful</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-9 rounded-full text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/10"
                aria-label="Voice input"
              >
                <MicIcon className="size-4" />
              </Button>
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                className="size-9 rounded-full text-muted-foreground hover:bg-black/[0.04] hover:text-foreground disabled:opacity-40 dark:hover:bg-white/10"
                aria-label="Create protocol"
                disabled={!plan.trim()}
              >
                <CornerDownLeftIcon className="size-4 stroke-[1.5]" />
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Press{" "}
          <kbd className="rounded border border-border bg-muted/60 px-1 font-mono">
            Esc
          </kbd>{" "}
          to close, or choose a thread in the sidebar.
        </p>
      </form>
    </div>
  )
}
