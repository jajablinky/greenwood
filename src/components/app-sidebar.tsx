"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  Link2Icon,
  MinusIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatShortTimeAgo } from "@/lib/format-short-time-ago"
import { cn } from "@/lib/utils"
import type { Protocol } from "@/lib/greenwood-mock-data"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const VISIBLE_FORKS = 6

/** Matches fork timestamp column so + actions align with chat preview text. */
const SIDEBAR_ROW_RAIL =
  "inline-flex w-6 shrink-0 justify-start [&_svg]:shrink-0"

const ARWEAVE_ADDRESS =
  "bnV64qzKsWuCeEQlo5S15A8RyFPWKdQPUX1d_uFdPM8"

function abbreviateMiddle(
  value: string,
  headChars = 6,
  tailChars = 5,
): string {
  const minLen = headChars + tailChars + 1
  if (value.length <= minLen) return value
  return `${value.slice(0, headChars)}…${value.slice(-tailChars)}`
}

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  protocols: Protocol[]
  selectedForkId: string
  onSelectFork: (forkId: string) => void
  onNewAgent: () => void
  onConnectContent: () => void
}

export function AppSidebar({
  protocols,
  selectedForkId,
  onSelectFork,
  onNewAgent,
  onConnectContent,
  ...props
}: AppSidebarProps) {
  const [forksExpanded, setForksExpanded] = React.useState<Record<string, boolean>>({})
  const [, setTimeTick] = React.useState(0)
  React.useEffect(() => {
    const id = window.setInterval(() => setTimeTick((n) => n + 1), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "pointer-events-none mb-1 flex h-14 w-full items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-left text-sm",
                "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>*:not(:first-child)]:hidden"
              )}
            >
              <span className="min-w-0 flex-1 truncate text-left text-sm font-medium tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:text-center group-data-[collapsible=icon]:text-[10px] group-data-[collapsible=icon]:leading-tight">
                PermawebOS
              </span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New Protocol"
              onClick={onNewAgent}
              className={cn(
                "rounded-lg font-normal tracking-wide text-muted-foreground",
                "hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                "active:bg-sidebar-accent/60 active:text-sidebar-foreground",
                "focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              )}
            >
              <span className={cn(SIDEBAR_ROW_RAIL, "items-center [&_svg]:opacity-50")}>
                <PlusIcon className="size-4" />
              </span>
              <span>New Protocol</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Connect content"
              onClick={onConnectContent}
              className={cn(
                "rounded-lg font-normal tracking-wide text-muted-foreground",
                "hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                "active:bg-sidebar-accent/60 active:text-sidebar-foreground",
                "focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              )}
            >
              <span className={cn(SIDEBAR_ROW_RAIL, "items-center [&_svg]:opacity-50")}>
                <Link2Icon className="size-4" />
              </span>
              <span>Connect content</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0 overflow-y-auto">
        <div className="group-data-[collapsible=icon]:hidden">
          {protocols.map((protocol) => {
            const expanded = forksExpanded[protocol.id] === true
            const forksSorted = [...protocol.forks].sort(
              (a, b) => b.createdAt - a.createdAt
            )
            const hasMany = forksSorted.length > VISIBLE_FORKS
            const visibleList =
              hasMany && !expanded
                ? forksSorted.slice(0, VISIBLE_FORKS)
                : forksSorted

            return (
              <Collapsible key={protocol.id} defaultOpen>
                <SidebarGroup className="py-2">
                  <CollapsibleTrigger
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left",
                      "text-sm font-normal tracking-wide text-muted-foreground",
                      "outline-none hover:bg-sidebar-accent/60 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                      "[&_svg]:-rotate-90 [&_svg]:transition-transform [&_svg]:duration-100 [&_svg]:ease-out",
                      "data-panel-open:[&_svg]:rotate-0"
                    )}
                  >
                    <span className="min-w-0 truncate">{protocol.name}</span>
                    <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu className="mt-1 gap-0.5">
                      {visibleList.map((fork) => (
                        <SidebarMenuItem key={fork.id}>
                          <SidebarMenuButton
                            isActive={selectedForkId === fork.id}
                            tooltip={fork.preview}
                            onClick={() => onSelectFork(fork.id)}
                            className="h-auto min-h-11 items-center gap-2 py-2"
                          >
                            <span
                              className={cn(
                                SIDEBAR_ROW_RAIL,
                                "tabular-nums text-left text-[10px] leading-none text-muted-foreground group-data-active/menu-button:text-sidebar-accent-foreground"
                              )}
                              title={new Date(fork.createdAt).toLocaleString()}
                            >
                              {formatShortTimeAgo(fork.createdAt)}
                            </span>
                            <span className="line-clamp-2 min-w-0 flex-1 text-left text-[13px] leading-snug font-normal text-sidebar-foreground/58 group-hover/menu-button:text-sidebar-accent-foreground group-data-active/menu-button:font-medium group-data-active/menu-button:text-sidebar-accent-foreground">
                              {fork.preview}
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                      {hasMany ? (
                        <SidebarMenuItem>
                          <button
                            type="button"
                            className={cn(
                              "inline-flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left text-sm font-medium",
                              "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                            onClick={() =>
                              setForksExpanded((prev) => ({
                                ...prev,
                                [protocol.id]: !expanded,
                              }))
                            }
                          >
                            <span
                              className={cn(
                                SIDEBAR_ROW_RAIL,
                                "items-center"
                              )}
                              aria-hidden
                            >
                              <span className="relative inline-flex size-4 items-center justify-center">
                                <PlusIcon
                                  className={cn(
                                    "absolute size-4 transition-all duration-200 ease-out",
                                    expanded &&
                                      "pointer-events-none scale-50 rotate-90 opacity-0"
                                  )}
                                />
                                <MinusIcon
                                  className={cn(
                                    "absolute size-4 transition-all duration-200 ease-out",
                                    !expanded &&
                                      "pointer-events-none scale-50 -rotate-90 opacity-0"
                                  )}
                                />
                              </span>
                            </span>
                            <span>{expanded ? "Less" : "More"}</span>
                          </button>
                        </SidebarMenuItem>
                      ) : null}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            )
          })}
        </div>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/20 px-2 py-2">
          <Avatar size="sm">
            <AvatarFallback className="text-[10px] font-medium">XY</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium">xylophonez</p>
            <p
              className="font-mono text-[10px] leading-tight text-muted-foreground"
              title={ARWEAVE_ADDRESS}
            >
              {abbreviateMiddle(ARWEAVE_ADDRESS)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label="Settings"
          >
            <SettingsIcon className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
