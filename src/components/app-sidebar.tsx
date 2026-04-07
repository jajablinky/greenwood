"use client"

import * as React from "react"
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  Layers2Icon,
  LayoutGridIcon,
  PackageIcon,
  SparklesIcon,
  UserIcon,
  UsersRoundIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

type Collection = "All" | "Product" | "Team" | "Personal"
type View = "today" | "board" | "done"

type TaskSlice = {
  lane: string
  collection: Exclude<Collection, "All">
}

const laneLabels: Record<View, string> = {
  today: "Today",
  board: "In progress",
  done: "Done",
}

const collectionIcons = {
  All: Layers2Icon,
  Product: PackageIcon,
  Team: UsersRoundIcon,
  Personal: UserIcon,
} as const

const viewIcons = {
  today: CalendarDaysIcon,
  board: LayoutGridIcon,
  done: CheckCircle2Icon,
} as const

function countTasks(tasks: TaskSlice[], collection: Collection) {
  if (collection === "All") {
    return tasks.filter((task) => task.lane !== "done").length
  }

  return tasks.filter(
    (task) => task.collection === collection && task.lane !== "done"
  ).length
}

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  collection: Collection
  view: View
  tasks: TaskSlice[]
  onCollectionChange: (collection: Collection) => void
  onViewChange: (view: View) => void
}

export function AppSidebar({
  collection,
  view,
  tasks,
  onCollectionChange,
  onViewChange,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Mock todo">
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:size-7">
                <SparklesIcon className="size-4" />
              </div>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Mock todo</span>
                <span className="truncate text-xs text-muted-foreground">
                  Local prototype
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Studio preview</SidebarGroupLabel>
          <SidebarGroupContent>
            <p className="px-2 text-sm leading-6 text-muted-foreground">
              Browse lists, move work between states, and open detail without
              wiring real data.
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarMenu>
            {(["All", "Product", "Team", "Personal"] as Collection[]).map(
              (item) => {
                const Icon = collectionIcons[item]
                return (
                  <SidebarMenuItem key={item}>
                    <SidebarMenuButton
                      isActive={collection === item}
                      tooltip={item}
                      onClick={() => onCollectionChange(item)}
                    >
                      <Icon className="shrink-0" />
                      <span>{item}</span>
                      <SidebarMenuBadge>
                        {countTasks(tasks, item)}
                      </SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              }
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {(["today", "board", "done"] as View[]).map((item) => {
              const Icon = viewIcons[item]
              return (
                <SidebarMenuItem key={item}>
                  <SidebarMenuButton
                    isActive={view === item}
                    tooltip={laneLabels[item]}
                    onClick={() => onViewChange(item)}
                  >
                    <Icon className="shrink-0" />
                    <span>{laneLabels[item]}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="flex flex-col gap-2 px-2 pb-2">
          <Badge
            variant="outline"
            className="w-fit rounded-none border-sidebar-border bg-background text-foreground"
          >
            v0 mock
          </Badge>
          <p className="text-xs leading-5 text-muted-foreground">
            Toggle with the panel control or ⌘B / Ctrl+B.
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
