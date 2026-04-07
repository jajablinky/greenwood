"use client"

import * as React from "react"
import { useCallback, useLayoutEffect, useRef, useState } from "react"
import {
  CheckCircle2Icon,
  Layers2Icon,
  ListOrderedIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

type Lane = "today" | "in-progress" | "waiting" | "done"
type WorkspaceStatus = "All" | Lane

type TaskSlice = {
  lane: Lane
}

const statusMenu: {
  status: WorkspaceStatus
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { status: "All", label: "All", icon: Layers2Icon },
  { status: "today", label: "Queued", icon: ListOrderedIcon },
  { status: "in-progress", label: "Running", icon: PlayCircleIcon },
  { status: "waiting", label: "Blocked", icon: PauseCircleIcon },
  { status: "done", label: "Settled", icon: CheckCircle2Icon },
]

function countTasks(tasks: TaskSlice[], filter: WorkspaceStatus) {
  if (filter === "All") {
    return tasks.length
  }

  return tasks.filter((task) => task.lane === filter).length
}

export type SessionRow = {
  id: string
  title: string
  laneLabel: string
  laneDotClass: string
  laneTextClass: string
  collection: string
  settled: boolean
}

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  workspaceStatus: WorkspaceStatus
  tasks: TaskSlice[]
  sessions: SessionRow[]
  selectedSessionId: string
  onWorkspaceStatusChange: (status: WorkspaceStatus) => void
  onSessionSelect: (sessionId: string) => void
}

export function AppSidebar({
  workspaceStatus,
  tasks,
  sessions,
  selectedSessionId,
  onWorkspaceStatusChange,
  onSessionSelect,
  ...props
}: AppSidebarProps) {
  const workspaceWrapRef = useRef<HTMLDivElement>(null)
  const workspaceItemRefs = useRef<
    Partial<Record<WorkspaceStatus, HTMLLIElement | null>>
  >({})
  const [workspaceHighlight, setWorkspaceHighlight] = useState<{
    top: number
    height: number
  } | null>(null)

  const measureWorkspaceHighlight = useCallback(() => {
    const wrap = workspaceWrapRef.current
    const li = workspaceItemRefs.current[workspaceStatus]
    if (!wrap || !li) {
      setWorkspaceHighlight(null)
      return
    }
    const wrapRect = wrap.getBoundingClientRect()
    const liRect = li.getBoundingClientRect()
    setWorkspaceHighlight({
      top: liRect.top - wrapRect.top + wrap.scrollTop,
      height: liRect.height,
    })
  }, [workspaceStatus])

  useLayoutEffect(() => {
    measureWorkspaceHighlight()
    const wrap = workspaceWrapRef.current
    if (!wrap) {
      return
    }
    const ro = new ResizeObserver(measureWorkspaceHighlight)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [measureWorkspaceHighlight])

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Agent orchestrator">
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:size-7">
                <SparklesIcon className="size-4" />
              </div>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Orchestrator</span>
                <span className="truncate text-xs text-muted-foreground">
                  Local control plane preview
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Sessions</SidebarGroupLabel>
          <SidebarGroupContent>
            <p className="px-2 text-sm leading-6 text-muted-foreground">
              Filter runs by lane status; the list mirrors Codex-style threads —
              pick one to load the run in the main panel.
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <div ref={workspaceWrapRef} className="relative w-full">
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute right-0 left-0 z-0 rounded-xl bg-sidebar-accent transition-[top,height,opacity] duration-300 ease-in-out",
                workspaceHighlight ? "opacity-100" : "opacity-0"
              )}
              style={
                workspaceHighlight
                  ? {
                      top: workspaceHighlight.top,
                      height: workspaceHighlight.height,
                    }
                  : { top: 0, height: 0 }
              }
            />
            <SidebarMenu className="relative z-1">
              {statusMenu.map(({ status, label, icon: Icon }) => (
                <SidebarMenuItem
                  key={status}
                  ref={(el) => {
                    workspaceItemRefs.current[status] = el
                  }}
                >
                  <SidebarMenuButton
                    isActive={workspaceStatus === status}
                    tooltip={label}
                    onClick={() => onWorkspaceStatusChange(status)}
                    className="relative z-1 data-active:bg-transparent data-active:hover:bg-transparent dark:data-active:bg-transparent dark:data-active:hover:bg-transparent"
                  >
                    <Icon className="shrink-0" />
                    <span>{label}</span>
                    <SidebarMenuBadge>
                      {countTasks(tasks, status)}
                    </SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {sessions.length === 0 ? (
              <p className="px-2 py-2 text-xs leading-5 text-muted-foreground">
                No sessions match this filter.
              </p>
            ) : (
              sessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    isActive={selectedSessionId === session.id}
                    tooltip={session.title}
                    onClick={() => onSessionSelect(session.id)}
                    className="h-auto min-h-12 items-start py-2"
                  >
                    <div className="grid min-w-0 flex-1 gap-1 text-left">
                      <span
                        className={`line-clamp-2 text-sm leading-snug font-medium ${session.settled ? "text-muted-foreground" : ""}`}
                      >
                        {session.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session.collection}
                      </span>
                    </div>
                    <span
                      className="flex shrink-0 items-center gap-1.5 pt-0.5"
                      title={session.laneLabel}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          session.laneDotClass
                        )}
                      />
                      <span
                        className={cn(
                          "max-w-18 truncate text-[10px] font-medium leading-tight",
                          session.laneTextClass
                        )}
                      >
                        {session.laneLabel}
                      </span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="flex flex-col gap-2 px-2 pb-2">
          <Badge
            variant="outline"
            className="w-fit rounded-none border-sidebar-border bg-background text-foreground"
          >
            Preview build
          </Badge>
          <p className="text-xs leading-5 text-muted-foreground">
            Collapse the rail with the control or ⌘B / Ctrl+B.
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
