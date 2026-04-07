import { useMemo, useState } from "react"
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleIcon,
  Clock3Icon,
  LayoutGridIcon,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type View = "today" | "board" | "done"
type Lane = "today" | "in-progress" | "waiting" | "done"
type Collection = "All" | "Product" | "Team" | "Personal"
type Priority = "Low" | "Medium" | "High"

type Task = {
  id: string
  title: string
  summary: string
  lane: Lane
  collection: Exclude<Collection, "All">
  priority: Priority
  due: string
  assignee: string
  note: string
}

const TASKS: Task[] = [
  {
    id: "t1",
    title: "Finalize launch checklist",
    summary: "Tighten hero copy, proof the CTA, and prep the release note.",
    lane: "today",
    collection: "Product",
    priority: "High",
    due: "Today, 2:00 PM",
    assignee: "Ava",
    note: "This is a mock task. The actions only change local UI state so you can click through the flow.",
  },
  {
    id: "t2",
    title: "Review onboarding feedback",
    summary: "Collect open comments from the latest usability round.",
    lane: "in-progress",
    collection: "Team",
    priority: "Medium",
    due: "Today, 4:30 PM",
    assignee: "Milo",
    note: "Use this state to preview a task that is already active and still in motion.",
  },
  {
    id: "t3",
    title: "Pay workspace invoice",
    summary: "Quick admin task kept in the same shell for visual variety.",
    lane: "waiting",
    collection: "Personal",
    priority: "Low",
    due: "Tomorrow, 9:00 AM",
    assignee: "You",
    note: "Waiting means blocked or postponed. Move it back to today from the detail modal.",
  },
  {
    id: "t4",
    title: "Ship weekly status update",
    summary: "Wrap highlights, blockers, and next priorities into one recap.",
    lane: "done",
    collection: "Team",
    priority: "Medium",
    due: "Completed",
    assignee: "Noah",
    note: "Done tasks stay editable in the mock so you can reopen them and test the alternate state.",
  },
]

const laneOrder: Array<Exclude<Lane, "done">> = [
  "today",
  "in-progress",
  "waiting",
]

const laneLabels: Record<Lane, string> = {
  today: "Today",
  "in-progress": "In progress",
  waiting: "Waiting",
  done: "Done",
}

function priorityTone(priority: Priority) {
  if (priority === "High") {
    return "border-foreground/20 bg-transparent text-foreground"
  }

  if (priority === "Medium") {
    return "border-border bg-transparent text-foreground"
  }

  return "border-border bg-transparent text-muted-foreground"
}

function statusCopy(lane: Lane) {
  if (lane === "done") {
    return "Completed"
  }

  if (lane === "today") {
    return "Up next"
  }

  if (lane === "in-progress") {
    return "Currently moving"
  }

  return "Blocked or deferred"
}

function collectionDescription(collection: Collection) {
  if (collection === "All") {
    return "A full snapshot across product, team, and personal work."
  }

  if (collection === "Product") {
    return "Shipping-focused tasks around polish, release prep, and refinement."
  }

  if (collection === "Team") {
    return "Shared follow-ups, recaps, and collaborative review work."
  }

  return "Light operational tasks and personal admin kept in the same shell."
}

function App() {
  const [view, setView] = useState<View>("today")
  const [collection, setCollection] = useState<Collection>("All")
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [selectedTaskId, setSelectedTaskId] = useState<string>(TASKS[0].id)
  const [detailOpen, setDetailOpen] = useState(false)

  const visibleTasks = useMemo(() => {
    if (collection === "All") {
      return tasks
    }

    return tasks.filter((task) => task.collection === collection)
  }, [collection, tasks])

  const todayTasks = visibleTasks.filter((task) => task.lane !== "done")
  const doneTasks = visibleTasks.filter((task) => task.lane === "done")
  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) ?? tasks[0]

  const metrics = [
    {
      label: "Open",
      value: String(
        tasks.filter((task) => task.lane !== "done").length
      ).padStart(2, "0"),
      note: "Tasks still in play",
    },
    {
      label: "Focus",
      value: String(
        tasks.filter((task) => task.priority === "High" && task.lane !== "done")
          .length
      ).padStart(2, "0"),
      note: "High priority cards",
    },
    {
      label: "Done",
      value: String(
        tasks.filter((task) => task.lane === "done").length
      ).padStart(2, "0"),
      note: "Closed in this mock",
    },
  ]

  function openTask(taskId: string) {
    setSelectedTaskId(taskId)
    setDetailOpen(true)
  }

  function moveTask(taskId: string, lane: Lane) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, lane } : task))
    )

    if (lane === "done") {
      setView("done")
    }
  }

  return (
    <SidebarProvider className="flex h-svh min-h-0 overflow-hidden bg-[#f7f7f6]">
      <AppSidebar
        collection={collection}
        view={view}
        tasks={tasks}
        onCollectionChange={setCollection}
        onViewChange={setView}
      />
      <SidebarInset className="min-h-0 overflow-y-auto bg-white dark:bg-background">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 bg-white px-5 py-6 lg:px-8 lg:py-6 dark:bg-background">
          <Tabs
            value={view}
            onValueChange={(nextValue) => setView(nextValue as View)}
            className="min-w-0"
          >
            <Card className="border border-border/70 bg-card shadow-none ring-0">
              <CardHeader className="gap-6 border-b border-border/60 pb-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <SidebarTrigger className="shrink-0 rounded-none" />
                    <Badge
                      variant="outline"
                      className="rounded-none border-border/70 bg-background"
                    >
                      iteration 03
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      local-only state
                    </span>
                  </div>
                  <TabsList
                    variant="line"
                    className="w-full justify-start rounded-none bg-transparent p-0 xl:w-auto"
                  >
                    <TabsTrigger
                      value="today"
                      className="rounded-none px-0 pr-8 pb-0"
                    >
                      <CalendarDaysIcon />
                      Today
                    </TabsTrigger>
                    <TabsTrigger
                      value="board"
                      className="rounded-none px-0 pr-8 pb-0"
                    >
                      <LayoutGridIcon />
                      Board
                    </TabsTrigger>
                    <TabsTrigger
                      value="done"
                      className="rounded-none px-0 pb-0"
                    >
                      <CheckCircle2Icon />
                      Done
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-[320px] flex-1 items-center gap-3 rounded-none border border-border/70 bg-background px-4">
                    <SearchIcon className="size-4 text-muted-foreground" />
                    <Input
                      aria-label="Search mock tasks"
                      placeholder="Search mock tasks"
                      className="rounded-none border-0 bg-transparent px-0 shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-none border-border/70 bg-background"
                  >
                    <SparklesIcon data-icon="inline-start" />
                    New mock task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <TabsContent value="today">
                  <div className="grid">
                    {todayTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onOpen={openTask}
                        onToggleDone={moveTask}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="board">
                  <div className="grid gap-5 xl:grid-cols-3">
                    {laneOrder.map((lane) => (
                      <Card
                        key={lane}
                        size="sm"
                        className="border border-border/70 bg-background shadow-none ring-0"
                      >
                        <CardHeader className="gap-2 border-b border-border/60 pb-4">
                          <CardTitle>{laneLabels[lane]}</CardTitle>
                          <CardDescription className="leading-6">
                            {
                              visibleTasks.filter((task) => task.lane === lane)
                                .length
                            }{" "}
                            cards in this state
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 pt-5">
                          {visibleTasks
                            .filter((task) => task.lane === lane)
                            .map((task) => (
                              <button
                                key={task.id}
                                type="button"
                                className="flex flex-col gap-4 rounded-none border border-border/60 bg-card px-4 py-4 text-left transition-colors hover:bg-muted/20"
                                onClick={() => openTask(task.id)}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="font-medium">{task.title}</p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                      {task.summary}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`rounded-none ${priorityTone(task.priority)}`}
                                  >
                                    {task.priority}
                                  </Badge>
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
                </TabsContent>

                <TabsContent value="done">
                  <div className="grid">
                    {doneTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onOpen={openTask}
                        onToggleDone={moveTask}
                      />
                    ))}
                  </div>
                </TabsContent>
              </CardContent>
              <CardFooter className="justify-between border-t border-border/60 pt-6 text-sm text-muted-foreground">
                <span>Mock interactions stay inside the browser session.</span>
                <Button
                  variant="outline"
                  className="rounded-none border-border/70 bg-background"
                  onClick={() => openTask(selectedTask.id)}
                >
                  <ArrowRightIcon data-icon="inline-start" />
                  Open selected task
                </Button>
              </CardFooter>
            </Card>
          </Tabs>

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
                <CardTitle>Active collection</CardTitle>
                <CardDescription className="leading-6">
                  {collectionDescription(collection)}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Collection</span>
                  <span>{collection}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Default entry</span>
                  <span>Today list</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Alt review</span>
                  <span>Board columns</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Closeout</span>
                  <span>Done archive</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="rounded-none border border-border bg-background shadow-none ring-0 sm:max-w-2xl">
          <DialogHeader>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <DialogDescription className="mt-3 max-w-xl leading-7">
                  {selectedTask.note}
                </DialogDescription>
              </div>
              <Badge
                variant="outline"
                className={`rounded-none ${priorityTone(selectedTask.priority)}`}
              >
                {selectedTask.priority}
              </Badge>
            </div>
          </DialogHeader>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="grid gap-5">
              <Card
                size="sm"
                className="rounded-none border border-border/70 bg-background shadow-none ring-0"
              >
                <CardHeader className="gap-3">
                  <CardTitle>Summary</CardTitle>
                  <CardDescription className="leading-6">
                    {selectedTask.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="flex items-center gap-4 rounded-none border border-border/60 bg-card px-4 py-4">
                    <Checkbox
                      checked={selectedTask.lane === "done"}
                      className="rounded-none"
                      onCheckedChange={(checked) =>
                        moveTask(
                          selectedTask.id,
                          checked === true ? "done" : "today"
                        )
                      }
                    />
                    <div>
                      <p className="font-medium">
                        {statusCopy(selectedTask.lane)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Toggle this to preview open and completed states.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 rounded-none border border-border/60 bg-card px-4 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CircleIcon className="size-3.5" />
                      Refine the content block
                    </div>
                    <div className="flex items-center gap-2">
                      <CircleIcon className="size-3.5" />
                      Share a quick internal review
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2Icon className="size-3.5" />
                      Prepare the presentation frame
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
                <CardTitle>Details</CardTitle>
                <CardDescription className="leading-6">
                  Static meta for the mock.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 text-sm">
                <div className="grid gap-1">
                  <span className="text-muted-foreground">Collection</span>
                  <span>{selectedTask.collection}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-muted-foreground">Assignee</span>
                  <span>{selectedTask.assignee}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-muted-foreground">Due</span>
                  <span>{selectedTask.due}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-muted-foreground">Status</span>
                  <span>{laneLabels[selectedTask.lane]}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            {selectedTask.lane === "done" ? (
              <Button
                variant="outline"
                className="rounded-none border-border"
                onClick={() => moveTask(selectedTask.id, "today")}
              >
                Re-open task
              </Button>
            ) : (
              <Button
                variant="outline"
                className="rounded-none border-border"
                onClick={() => moveTask(selectedTask.id, "done")}
              >
                Mark done
              </Button>
            )}
            <Button
              variant="outline"
              className="rounded-none border-border"
              onClick={() => moveTask(selectedTask.id, "waiting")}
            >
              Snooze
            </Button>
            <Button
              className="rounded-none"
              onClick={() => moveTask(selectedTask.id, "today")}
            >
              Move to today
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

type TaskRowProps = {
  task: Task
  onOpen: (taskId: string) => void
  onToggleDone: (taskId: string, lane: Lane) => void
}

function TaskRow({ task, onOpen, onToggleDone }: TaskRowProps) {
  return (
    <div className="grid gap-4 border-b border-border/50 py-6 last:border-b-0 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start">
      <Checkbox
        checked={task.lane === "done"}
        className="rounded-none"
        onCheckedChange={(checked) =>
          onToggleDone(task.id, checked === true ? "done" : "today")
        }
      />
      <button
        type="button"
        className="min-w-0 text-left"
        onClick={() => onOpen(task.id)}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="font-medium">{task.title}</p>
            <Badge
              variant="outline"
              className={`rounded-none ${priorityTone(task.priority)}`}
            >
              {task.priority}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-none border-border bg-transparent text-muted-foreground"
            >
              {task.collection}
            </Badge>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {task.summary}
          </p>
        </div>
      </button>
      <div className="flex items-center gap-8 pt-0.5 text-xs text-muted-foreground md:justify-self-end">
        <div className="flex items-center gap-2">
          <Clock3Icon className="size-3.5" />
          <span>{task.due}</span>
        </div>
        <Button
          variant="ghost"
          className="rounded-none"
          onClick={() => onOpen(task.id)}
        >
          Open
        </Button>
      </div>
    </div>
  )
}

export default App
