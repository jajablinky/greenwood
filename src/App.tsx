import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2Icon,
  CircleIcon,
  LayoutGridIcon,
  ListIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type LayoutMode = "session" | "board"
type Lane = "today" | "in-progress" | "waiting" | "done"
type Collection = "Production" | "Research" | "Ops"
type WorkspaceStatus = "All" | Lane
type Priority = "Low" | "Medium" | "High"

type Task = {
  id: string
  title: string
  summary: string
  lane: Lane
  collection: Collection
  priority: Priority
  due: string
  assignee: string
  note: string
}

const TASKS: Task[] = [
  {
    id: "t1",
    title: "Promote evaluator bundle to production",
    summary:
      "Verify regression gates, align tool policies with the release train, and attach the run manifest.",
    lane: "today",
    collection: "Production",
    priority: "High",
    due: "Today, 2:00 PM",
    assignee: "Ava",
    note: "Preview run: controls only adjust local session state so you can rehearse promotion, blocking, and settlement without a live control plane.",
  },
  {
    id: "t2",
    title: "Synthesize pilot feedback into tool routing",
    summary:
      "Cluster failure modes from the latest human-in-the-loop cohort and queue policy diffs.",
    lane: "in-progress",
    collection: "Research",
    priority: "Medium",
    due: "Today, 4:30 PM",
    assignee: "Milo",
    note: "Represents a run that is mid-flight while downstream agents are still emitting partial results.",
  },
  {
    id: "t3",
    title: "Rotate credentials for external tool connectors",
    summary:
      "Ops run: swap secrets, smoke OAuth handshakes, and record the maintenance window.",
    lane: "waiting",
    collection: "Ops",
    priority: "Low",
    due: "Tomorrow, 9:00 AM",
    assignee: "You",
    note: "Parked pending security sign-off. Unblock from here or promote back to the queue when ready.",
  },
  {
    id: "t4",
    title: "Publish orchestration health digest",
    summary:
      "Throughput, handoff latency, and incident roll-ups for stakeholders.",
    lane: "done",
    collection: "Research",
    priority: "Medium",
    due: "Completed",
    assignee: "Noah",
    note: "Settled runs stay editable in this preview so you can reopen them and walk states backward.",
  },
]

const laneOrder: Array<Exclude<Lane, "done">> = [
  "today",
  "in-progress",
  "waiting",
]

const laneLabels: Record<Lane, string> = {
  today: "Queued",
  "in-progress": "Running",
  waiting: "Blocked",
  done: "Settled",
}

const laneSortOrder: Record<Lane, number> = {
  "in-progress": 0,
  today: 1,
  waiting: 2,
  done: 3,
}

function sortSessionsForSidebar(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    const d = laneSortOrder[a.lane] - laneSortOrder[b.lane]
    if (d !== 0) {
      return d
    }
    return a.title.localeCompare(b.title)
  })
}

function priorityDotClass(priority: Priority) {
  if (priority === "High") {
    return "bg-destructive"
  }
  if (priority === "Medium") {
    return "bg-amber-500 dark:bg-amber-400"
  }
  return "bg-blue-500 dark:bg-blue-400"
}

function laneDotClass(lane: Lane) {
  switch (lane) {
    case "today":
      return "bg-sky-500 dark:bg-sky-400"
    case "in-progress":
      return "bg-emerald-500 dark:bg-emerald-400"
    case "waiting":
      return "bg-red-600 dark:bg-red-500"
    case "done":
      return "bg-teal-600 dark:bg-teal-400"
    default:
      return "bg-muted-foreground"
  }
}

function laneLabelTextClass(lane: Lane) {
  switch (lane) {
    case "today":
      return "text-sky-800 dark:text-sky-200"
    case "in-progress":
      return "text-emerald-800 dark:text-emerald-200"
    case "waiting":
      return "text-red-800 dark:text-red-200"
    case "done":
      return "text-teal-900 dark:text-teal-100"
    default:
      return "text-foreground"
  }
}

function laneColumnTopClass(lane: (typeof laneOrder)[number]) {
  switch (lane) {
    case "today":
      return "border-t-sky-500"
    case "in-progress":
      return "border-t-emerald-500"
    case "waiting":
      return "border-t-red-600 dark:border-t-red-500"
    default:
      return "border-t-border"
  }
}

function PrioritySignal({
  priority,
  className,
}: {
  priority: Priority
  className?: string
}) {
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          priorityDotClass(priority)
        )}
      />
      <span className="text-sm font-medium tabular-nums text-foreground">
        {priority}
      </span>
    </span>
  )
}

function statusCopy(lane: Lane) {
  if (lane === "done") {
    return "Settled"
  }

  if (lane === "today") {
    return "Eligible for dispatch"
  }

  if (lane === "in-progress") {
    return "Agents executing"
  }

  return "Parked — awaiting dependency"
}

function workspaceStatusDescription(status: WorkspaceStatus) {
  if (status === "All") {
    return "Every run regardless of lane — queued, in flight, blocked, or settled."
  }

  if (status === "today") {
    return "Runs eligible for dispatch; next up in the orchestration queue."
  }

  if (status === "in-progress") {
    return "Agents actively executing with partial results still streaming."
  }

  if (status === "waiting") {
    return "Parked on dependencies, sign-off, or external readiness."
  }

  return "Completed or archived runs you can still reopen in this preview."
}

function filterTasksBySearch(tasks: Task[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) {
    return tasks
  }

  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(q) ||
      task.summary.toLowerCase().includes(q) ||
      task.assignee.toLowerCase().includes(q) ||
      task.collection.toLowerCase().includes(q) ||
      laneLabels[task.lane].toLowerCase().includes(q)
  )
}

type RunDetailPanelProps = {
  task: Task
  onMove: (taskId: string, lane: Lane) => void
}

function RunDetailPanel({ task, onMove }: RunDetailPanelProps) {
  return (
    <>
      <div className="flex flex-col gap-5 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">{task.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            {task.note}
          </p>
        </div>
        <PrioritySignal
          priority={task.priority}
          className="shrink-0 sm:pt-0.5"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="grid gap-5">
          <Card
            size="sm"
            className="rounded-none border border-border/70 bg-background shadow-none ring-0"
          >
            <CardHeader className="gap-3">
              <CardTitle>Run brief</CardTitle>
              <CardDescription className="leading-6">
                {task.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4 rounded-none border border-border/60 bg-card px-4 py-4">
                <Checkbox
                  checked={task.lane === "done"}
                  className="rounded-none"
                  onCheckedChange={(checked) =>
                    onMove(task.id, checked === true ? "done" : "today")
                  }
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        laneDotClass(task.lane)
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-semibold tracking-[0.14em] uppercase",
                        laneLabelTextClass(task.lane)
                      )}
                    >
                      {laneLabels[task.lane]}
                    </span>
                  </p>
                  <p className="font-medium text-foreground">
                    {statusCopy(task.lane)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Flip to rehearse settlement vs. putting the run back on the
                    dispatch list.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 rounded-none border border-border/60 bg-card px-4 py-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CircleIcon className="size-3.5" />
                  Confirm tool budget and escalation path
                </div>
                <div className="flex items-center gap-2">
                  <CircleIcon className="size-3.5" />
                  Dry-run plan against staging fixtures
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-3.5" />
                  Pin model routing for this shift window
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card
          size="sm"
          className="rounded-none border border-border/70 bg-background shadow-none ring-0"
        >
          <CardHeader className="gap-3">
            <CardTitle>Telemetry</CardTitle>
            <CardDescription className="leading-6">
              Run metadata for this local preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 text-sm">
            <div className="grid gap-1">
              <span className="text-muted-foreground">Workspace</span>
              <span>{task.collection}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Owner</span>
              <span>{task.assignee}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">SLO / window</span>
              <span>{task.due}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Lane</span>
              <span className="flex items-center gap-1.5 font-medium">
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    laneDotClass(task.lane)
                  )}
                />
                <span className={laneLabelTextClass(task.lane)}>
                  {laneLabels[task.lane]}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border/60 pt-6">
        {task.lane === "done" ? (
          <Button
            variant="outline"
            className="rounded-none border-border"
            onClick={() => onMove(task.id, "today")}
          >
            Reopen run
          </Button>
        ) : (
          <Button
            variant="outline"
            className="rounded-none border-border"
            onClick={() => onMove(task.id, "done")}
          >
            Mark settled
          </Button>
        )}
        <Button
          variant="outline"
          className="rounded-none border-border"
          onClick={() => onMove(task.id, "waiting")}
        >
          Park run
        </Button>
        <Button
          className="rounded-none"
          onClick={() => onMove(task.id, "today")}
        >
          Queue now
        </Button>
      </div>
    </>
  )
}

function App() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("session")
  const [workspaceStatus, setWorkspaceStatus] =
    useState<WorkspaceStatus>("All")
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [selectedTaskId, setSelectedTaskId] = useState<string>(TASKS[0].id)
  const [searchQuery, setSearchQuery] = useState("")

  const visibleTasks = useMemo(() => {
    if (workspaceStatus === "All") {
      return tasks
    }

    return tasks.filter((task) => task.lane === workspaceStatus)
  }, [workspaceStatus, tasks])

  const filteredForSearch = useMemo(
    () => filterTasksBySearch(visibleTasks, searchQuery),
    [visibleTasks, searchQuery]
  )

  const sidebarSessions = useMemo(
    () => sortSessionsForSidebar(filteredForSearch),
    [filteredForSearch]
  )

  const boardTasks = filteredForSearch

  const selectedTask = useMemo((): Task | null => {
    const match = sidebarSessions.find((task) => task.id === selectedTaskId)
    if (match) {
      return match
    }
    return sidebarSessions[0] ?? null
  }, [sidebarSessions, selectedTaskId])

  useEffect(() => {
    if (
      sidebarSessions.length > 0 &&
      !sidebarSessions.some((t) => t.id === selectedTaskId)
    ) {
      setSelectedTaskId(sidebarSessions[0].id)
    }
  }, [sidebarSessions, selectedTaskId])

  const metrics = [
    {
      label: "Active",
      value: String(
        tasks.filter((task) => task.lane !== "done").length
      ).padStart(2, "0"),
      note: "Runs not yet settled",
    },
    {
      label: "Critical",
      value: String(
        tasks.filter((task) => task.priority === "High" && task.lane !== "done")
          .length
      ).padStart(2, "0"),
      note: "High-priority runs in flight",
    },
    {
      label: "Settled",
      value: String(
        tasks.filter((task) => task.lane === "done").length
      ).padStart(2, "0"),
      note: "Completed in this session",
    },
  ]

  function selectSession(taskId: string) {
    setSelectedTaskId(taskId)
    setLayoutMode("session")
  }

  function moveTask(taskId: string, lane: Lane) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, lane } : task))
    )
  }

  const sessionRows = sidebarSessions.map((task) => ({
    id: task.id,
    title: task.title,
    laneLabel: laneLabels[task.lane],
    laneDotClass: laneDotClass(task.lane),
    laneTextClass: laneLabelTextClass(task.lane),
    collection: task.collection,
    settled: task.lane === "done",
  }))

  return (
    <SidebarProvider className="flex h-svh min-h-0 overflow-hidden bg-[#f7f7f6]">
      <AppSidebar
        workspaceStatus={workspaceStatus}
        tasks={tasks}
        sessions={sessionRows}
        selectedSessionId={selectedTask?.id ?? ""}
        onWorkspaceStatusChange={setWorkspaceStatus}
        onSessionSelect={selectSession}
      />
      <SidebarInset className="min-h-0 overflow-y-auto bg-white dark:bg-background">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 bg-white px-5 py-6 lg:px-8 lg:py-6 dark:bg-background">
          <Card className="border border-border/70 bg-card shadow-none ring-0">
            <CardHeader className="gap-6 border-b border-border/60 pb-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                  <SidebarTrigger className="shrink-0 rounded-none" />
                  <Badge
                    variant="outline"
                    className="rounded-none border-border/70 bg-background"
                  >
                    orchestration · 03
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    session state · not persisted
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end xl:max-w-2xl">
                  <div className="relative flex rounded-none border border-border/70 bg-background p-0.5">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 z-0 w-[calc(50%-0.125rem)] rounded-none bg-primary shadow-sm transition-transform duration-300 ease-in-out"
                      style={{
                        transform:
                          layoutMode === "session"
                            ? "translateX(0)"
                            : "translateX(100%)",
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "relative z-1 flex-1 rounded-none hover:bg-transparent dark:hover:bg-transparent",
                        layoutMode === "session"
                          ? "text-primary-foreground hover:bg-primary/85 dark:hover:bg-primary/85"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setLayoutMode("session")}
                    >
                      <ListIcon data-icon="inline-start" className="size-4" />
                      Session
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "relative z-1 flex-1 rounded-none hover:bg-transparent dark:hover:bg-transparent",
                        layoutMode === "board"
                          ? "text-primary-foreground hover:bg-primary/85 dark:hover:bg-primary/85"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setLayoutMode("board")}
                    >
                      <LayoutGridIcon
                        data-icon="inline-start"
                        className="size-4"
                      />
                      Board
                    </Button>
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-none border border-border/70 bg-background px-4">
                    <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                      aria-label="Search sessions"
                      placeholder="Search sessions…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="rounded-none border-0 bg-transparent px-0 shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="shrink-0 rounded-none border-border/70 bg-background"
                  >
                    <SparklesIcon data-icon="inline-start" />
                    New run
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {layoutMode === "session" ? (
                sidebarSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                    <p className="text-sm font-medium text-foreground">
                      No sessions match
                    </p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      Try another status filter or clear the search, then
                      choose a session from the sidebar.
                    </p>
                  </div>
                ) : selectedTask ? (
                  <RunDetailPanel task={selectedTask} onMove={moveTask} />
                ) : null
              ) : (
                <div className="grid gap-5 xl:grid-cols-3">
                  {laneOrder.map((lane) => (
                    <Card
                      key={lane}
                      size="sm"
                      className={cn(
                        "border border-border/70 border-t-[3px] bg-background shadow-none ring-0",
                        laneColumnTopClass(lane)
                      )}
                    >
                      <CardHeader className="gap-2 border-b border-border/60 pb-4">
                        <CardTitle>{laneLabels[lane]}</CardTitle>
                        <CardDescription className="leading-6">
                          {
                            boardTasks.filter((task) => task.lane === lane)
                              .length
                          }{" "}
                          runs in this lane
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-3 pt-5">
                        {boardTasks
                          .filter((task) => task.lane === lane)
                          .map((task) => (
                            <button
                              key={task.id}
                              type="button"
                              className="flex flex-col gap-4 rounded-none border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:bg-muted/20"
                              onClick={() => selectSession(task.id)}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-medium">{task.title}</p>
                                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {task.summary}
                                  </p>
                                </div>
                                <PrioritySignal
                                  priority={task.priority}
                                  className="shrink-0"
                                />
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{task.assignee}</span>
                                <span>{task.due}</span>
                              </div>
                            </button>
                          ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Codex-style flow: sidebar session → main detail; Board is the
                lane map. Nothing leaves this browser.
              </span>
            </CardFooter>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="border border-border/70 bg-card shadow-none ring-0">
              <CardContent className="grid gap-6 pt-6 md:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="grid gap-3">
                    <CardDescription>{metric.label}</CardDescription>
                    <CardTitle className="text-3xl leading-none">
                      {metric.value}
                    </CardTitle>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {metric.note}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border/70 bg-card shadow-none ring-0">
              <CardHeader className="gap-3 border-b border-border/60 pb-5">
                <CardTitle>Status filter</CardTitle>
                <CardDescription className="leading-6">
                  {workspaceStatusDescription(workspaceStatus)}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span>
                    {workspaceStatus === "All"
                      ? "All"
                      : laneLabels[workspaceStatus]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Session panel</span>
                  <span>Main · Session</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lane map</span>
                  <span>Main · Board</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Thread list</span>
                  <span>Sidebar · Recent</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
