import * as React from "react"
import { Link2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  CONNECT_CONTENT_ITEMS,
  type ConnectContentCategory,
  type ConnectContentItem,
} from "@/lib/greenwood-mock-data"

const FILTERS: { id: ConnectContentCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "social", label: "Social" },
  { id: "videos", label: "Videos" },
  { id: "images", label: "Images" },
  { id: "text", label: "Text" },
  { id: "protocol", label: "Protocol" },
]

type ConnectContentPanelProps = {
  className?: string
  onOpenProtocol?: (protocolId: string) => void
}

export function ConnectContentPanel({
  className,
  onOpenProtocol,
}: ConnectContentPanelProps) {
  const [filter, setFilter] = React.useState<ConnectContentCategory | "all">(
    "all"
  )

  const items = React.useMemo(() => {
    if (filter === "all") return CONNECT_CONTENT_ITEMS
    return CONNECT_CONTENT_ITEMS.filter((i) => i.category === filter)
  }, [filter])

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        className
      )}
    >
      <div className="shrink-0 border-b border-black/[0.06] px-4 py-4 dark:border-white/[0.08] sm:px-6">
        <h1 className="text-sm font-medium tracking-tight text-foreground">
          Connect content
        </h1>
        <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
          Browse permaweb surfaces and hook your app to a protocol timeline.
        </p>
        <div
          className="mt-4 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Content filters"
        >
          {FILTERS.map((f) => (
            <Button
              key={f.id}
              type="button"
              variant={filter === f.id ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-8 shrink-0 rounded-full px-3 text-xs font-normal",
                filter === f.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
          {items.map((item) => (
            <ConnectCard
              key={item.id}
              item={item}
              onOpenProtocol={onOpenProtocol}
            />
          ))}
        </div>
        {items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Nothing in this filter yet.
          </p>
        ) : null}
      </div>
    </div>
  )
}

function ConnectCard({
  item,
  onOpenProtocol,
}: {
  item: ConnectContentItem
  onOpenProtocol?: (protocolId: string) => void
}) {
  const heights = React.useMemo(
    () => ["min-h-[112px]", "min-h-[132px]", "min-h-[96px]", "min-h-[124px]"],
    []
  )
  const h = heights[hashString(item.id) % heights.length]

  return (
    <article
      className={cn(
        "mb-3 break-inside-avoid rounded-xl border border-black/[0.08] bg-white p-3.5 shadow-sm dark:border-white/[0.12] dark:bg-card sm:mb-4",
        h
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-[13px] font-medium leading-snug text-foreground">
          {item.title}
        </h2>
        <span className="shrink-0 rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {item.category}
        </span>
      </div>
      {item.hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{item.hint}</p>
      ) : null}
      {item.protocolName ? (
        <p className="mt-3 font-mono text-[10px] leading-tight text-muted-foreground">
          {item.protocolName}
        </p>
      ) : null}
      {item.protocolId && onOpenProtocol ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3 h-8 w-full justify-center gap-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onOpenProtocol(item.protocolId!)}
        >
          <Link2Icon className="size-3.5 opacity-70" />
          Open protocol
        </Button>
      ) : null}
    </article>
  )
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}
