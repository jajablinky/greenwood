import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react"
import {
  CornerDownLeftIcon,
  GlobeIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { ChatTranscript } from "@/components/chat-transcript"
import { BrowserPanel } from "@/components/browser-panel"
import { ConnectContentPanel } from "@/components/connect-content-panel"
import { LeftSidebarResizeHandle } from "@/components/left-sidebar-resize-handle"
import { NewAppFlow } from "@/components/new-app-flow"
import { NewProtocolFlow } from "@/components/new-protocol-flow"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  buildMergedProtocolThread,
  findForkContext,
  INITIAL_PROTOCOLS,
  mockAssistantFollowUp,
  newForkId,
  newProtocolId,
  seedThreadFromFork,
  type Protocol,
  type ThreadMessage,
} from "@/lib/greenwood-mock-data"

const LEFT_SIDEBAR_MIN_PX = 220
const LEFT_SIDEBAR_MAX_PX = 440
const LEFT_SIDEBAR_DEFAULT_PX = 256

/** Main chat canvas: brighter than shell/sidebar `#f7f7f6`, not pure white */
const chatCanvasClass = "bg-white dark:bg-background"

function sortForksNewestFirst(forks: Protocol["forks"]) {
  return [...forks].sort((a, b) => b.createdAt - a.createdAt)
}

const INITIAL_FORK_ID = "p-jaja-research-f1"

function App() {
  const [protocols, setProtocols] = useState<Protocol[]>(INITIAL_PROTOCOLS)
  const [selectedForkId, setSelectedForkId] = useState(INITIAL_FORK_ID)
  const [browserOpen, setBrowserOpen] = useState(false)
  const [leftSidebarWidthPx, setLeftSidebarWidthPx] = useState(
    LEFT_SIDEBAR_DEFAULT_PX
  )
  const [mainView, setMainView] = useState<"chat" | "connect">("chat")
  const [newProtocolFlowOpen, setNewProtocolFlowOpen] = useState(false)
  const [newProtocolPlan, setNewProtocolPlan] = useState("")
  const [newAppFlowOpen, setNewAppFlowOpen] = useState(false)
  const [newAppPlan, setNewAppPlan] = useState("")
  const [newAppHookedProtocolId, setNewAppHookedProtocolId] = useState("")
  const [followUpDraft, setFollowUpDraft] = useState("")
  const [threads, setThreads] = useState<Record<string, ThreadMessage[]>>({})

  const active = useMemo(
    () => findForkContext(protocols, selectedForkId),
    [protocols, selectedForkId]
  )

  const threadForActive = useMemo(() => {
    if (!active) {
      return []
    }
    return buildMergedProtocolThread(active.protocol, threads)
  }, [active, threads])

  const handleRevertToMessage = useCallback(
    (messageId: string) => {
      if (!active) {
        return
      }
      const { protocol } = active
      setThreads((prev) => {
        for (const f of protocol.forks) {
          const list = prev[f.id] ?? seedThreadFromFork(f)
          const idx = list.findIndex((m) => m.id === messageId)
          if (idx !== -1) {
            return { ...prev, [f.id]: list.slice(0, idx + 1) }
          }
        }
        return prev
      })
    },
    [active]
  )

  function handleSelectFork(forkId: string) {
    setMainView("chat")
    setNewProtocolFlowOpen(false)
    setNewAppFlowOpen(false)
    setSelectedForkId(forkId)
    setFollowUpDraft("")
  }

  function selectProtocol(protocolId: string) {
    const protocol = protocols.find((p) => p.id === protocolId)
    if (!protocol || protocol.forks.length === 0) {
      return
    }
    setMainView("chat")
    setNewProtocolFlowOpen(false)
    setNewAppFlowOpen(false)
    const [latest] = sortForksNewestFirst(protocol.forks)
    setSelectedForkId(latest.id)
    setFollowUpDraft("")
  }

  function handleSend(e?: FormEvent) {
    e?.preventDefault()
    const text = followUpDraft.trim()
    if (!text || !active) {
      return
    }
    const { fork } = active
    const userMsg: ThreadMessage = {
      id: `${fork.id}-u-${Date.now()}`,
      role: "user",
      body: text,
    }
    const reply = mockAssistantFollowUp()
    setThreads((prev) => {
      const existing = prev[fork.id] ?? seedThreadFromFork(fork)
      return {
        ...prev,
        [fork.id]: [...existing, userMsg, reply],
      }
    })
    setFollowUpDraft("")
  }

  function handleNewProtocolSubmit(e: FormEvent) {
    e.preventDefault()
    const plan = newProtocolPlan.trim()
    if (!plan) {
      return
    }
    const name =
      plan.split("\n")[0]?.trim().slice(0, 120) || "New protocol"
    const pid = newProtocolId()
    const fid = newForkId(pid)
    const preview = name
    const protocol: Protocol = {
      id: pid,
      name,
      forks: [
        {
          id: fid,
          preview,
          createdAt: Date.now(),
        },
      ],
    }
    setProtocols((prev) => [protocol, ...prev])
    setSelectedForkId(fid)
    setFollowUpDraft("")
    setNewProtocolFlowOpen(false)
    setNewProtocolPlan("")
    const userMsg: ThreadMessage = {
      id: `${fid}-u-start`,
      role: "user",
      body: plan,
    }
    setThreads((prev) => ({
      ...prev,
      [fid]: [userMsg, mockAssistantFollowUp()],
    }))
  }

  function handleNewAppSubmit(e: FormEvent) {
    e.preventDefault()
    const plan = newAppPlan.trim()
    if (!plan || !newAppHookedProtocolId) {
      return
    }
    const hook = protocols.find((p) => p.id === newAppHookedProtocolId)
    const name =
      plan.split("\n")[0]?.trim().slice(0, 120) || "New app"
    const preview = name
    const pid = newProtocolId()
    const fid = newForkId(pid)
    const protocol: Protocol = {
      id: pid,
      name,
      forks: [
        {
          id: fid,
          preview,
          createdAt: Date.now(),
        },
      ],
      hooksIntoProtocolId: newAppHookedProtocolId,
    }
    setProtocols((prev) => [protocol, ...prev])
    setSelectedForkId(fid)
    setFollowUpDraft("")
    setNewAppFlowOpen(false)
    setNewAppPlan("")
    const hookLabel = hook?.name ?? newAppHookedProtocolId
    const userMsg: ThreadMessage = {
      id: `${fid}-u-start`,
      role: "user",
      body: `[Hook: ${hookLabel}]\n\n${plan}`,
    }
    setThreads((prev) => ({
      ...prev,
      [fid]: [userMsg, mockAssistantFollowUp()],
    }))
  }

  function openNewProtocolFlow() {
    setMainView("chat")
    setNewProtocolFlowOpen(true)
    setNewAppFlowOpen(false)
    setNewProtocolPlan("")
  }

  function openNewAppFlow() {
    setMainView("chat")
    setNewAppFlowOpen(true)
    setNewProtocolFlowOpen(false)
    setNewAppPlan("")
    setNewAppHookedProtocolId((id) => {
      if (id && protocols.some((p) => p.id === id)) {
        return id
      }
      return protocols[0]?.id ?? ""
    })
  }

  function openConnectContent() {
    setMainView("connect")
    setNewProtocolFlowOpen(false)
    setNewAppFlowOpen(false)
  }

  const headerTitle =
    mainView === "connect"
      ? "Connect content"
      : newAppFlowOpen
        ? "New app"
        : newProtocolFlowOpen
          ? "New protocol"
          : active?.protocol.name?.trim() || "Select a chat"

  const headerTitleShort =
    headerTitle.length > 48 ? `${headerTitle.slice(0, 45)}…` : headerTitle

  const chatColumn = (
    <div className={cn("flex h-full min-h-0 flex-col", chatCanvasClass)}>
      <header
        className={cn(
          "flex shrink-0 items-center gap-2 px-3 py-2.5 sm:px-4",
          chatCanvasClass
        )}
      >
        <SidebarTrigger className="shrink-0 rounded-lg" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="min-w-0 truncate text-sm font-medium text-foreground">
            {headerTitleShort}
          </span>
        </div>
        <Button
          type="button"
          variant={browserOpen ? "secondary" : "ghost"}
          size="icon-sm"
          className="shrink-0 rounded-lg"
          aria-label={browserOpen ? "Hide browser panel" : "Show browser panel"}
          aria-pressed={browserOpen}
          onClick={() => setBrowserOpen((o) => !o)}
        >
          <GlobeIcon className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Chat options"
          >
            <MoreHorizontalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Open protocol
            </div>
            {protocols.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => selectProtocol(p.id)}
                className="cursor-pointer"
              >
                {p.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Copy chat link
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Rename thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {mainView === "connect" ? (
        <ConnectContentPanel
          className={chatCanvasClass}
          onOpenProtocol={selectProtocol}
        />
      ) : newAppFlowOpen ? (
        <NewAppFlow
          plan={newAppPlan}
          onPlanChange={setNewAppPlan}
          hookedProtocolId={newAppHookedProtocolId}
          onHookedProtocolChange={setNewAppHookedProtocolId}
          protocols={protocols.map((p) => ({ id: p.id, name: p.name }))}
          onSubmit={handleNewAppSubmit}
          onDismiss={() => setNewAppFlowOpen(false)}
          className={chatCanvasClass}
        />
      ) : newProtocolFlowOpen ? (
        <NewProtocolFlow
          plan={newProtocolPlan}
          onPlanChange={setNewProtocolPlan}
          onSubmit={handleNewProtocolSubmit}
          onDismiss={() => setNewProtocolFlowOpen(false)}
          className={chatCanvasClass}
        />
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl px-4 py-8 leading-normal sm:px-6">
              {active ? (
                <ChatTranscript
                  messages={threadForActive}
                  selectedForkId={selectedForkId}
                  onRevertToMessage={handleRevertToMessage}
                />
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Select a fork from the sidebar to open the thread.
                </p>
              )}
            </div>
          </div>

          <div
            className={cn("shrink-0 px-4 pb-8 pt-2 sm:px-8", chatCanvasClass)}
          >
            <div className="mx-auto w-full max-w-3xl">
              <form
                className={cn(
                  "flex min-h-[52px] items-center gap-1.5 rounded-none border border-black/[0.08] bg-white px-3 py-2 pl-4 shadow-none dark:border-white/[0.12] dark:bg-card",
                  !active && "opacity-60"
                )}
                onSubmit={handleSend}
              >
                <label htmlFor="follow-up-composer" className="sr-only">
                  Send follow-up
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/10"
                  aria-label="Add attachment"
                  disabled={!active}
                >
                  <PlusIcon className="size-4" />
                </Button>
                <textarea
                  id="follow-up-composer"
                  rows={1}
                  value={followUpDraft}
                  onChange={(e) => setFollowUpDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Send follow-up"
                  disabled={!active}
                  className={cn(
                    "max-h-32 min-h-[36px] min-w-0 flex-1 resize-none bg-transparent py-2 text-[15px] leading-normal text-foreground outline-none placeholder:text-muted-foreground",
                    !active && "cursor-not-allowed"
                  )}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon-sm"
                  className="size-9 shrink-0 rounded-full text-muted-foreground hover:bg-black/[0.04] hover:text-foreground disabled:opacity-40 dark:hover:bg-white/10"
                  aria-label="Send follow-up"
                  disabled={!active}
                >
                  <CornerDownLeftIcon className="size-4 stroke-[1.5]" />
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <SidebarProvider
      className="flex h-svh min-h-0 overflow-hidden bg-[#f7f7f6]"
      style={
        {
          "--sidebar-width": `${leftSidebarWidthPx}px`,
        } as CSSProperties
      }
    >
      <AppSidebar
        protocols={protocols}
        selectedForkId={selectedForkId}
        onSelectFork={handleSelectFork}
        onNewAgent={openNewProtocolFlow}
        onNewApp={openNewAppFlow}
        onConnectContent={openConnectContent}
      />
      <SidebarInset
        className={cn(
          "relative flex min-h-0 flex-1 flex-row overflow-hidden",
          chatCanvasClass,
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-[1rem] md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2"
        )}
      >
        <LeftSidebarResizeHandle
          widthPx={leftSidebarWidthPx}
          minPx={LEFT_SIDEBAR_MIN_PX}
          maxPx={LEFT_SIDEBAR_MAX_PX}
          defaultWidthPx={LEFT_SIDEBAR_DEFAULT_PX}
          onWidthChange={setLeftSidebarWidthPx}
        />
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
            chatCanvasClass
          )}
        >
          {browserOpen ? (
            <ResizablePanelGroup
              orientation="horizontal"
              className="flex min-h-0 flex-1"
            >
              <ResizablePanel
                id="greenwood-chat"
                defaultSize="62%"
                minSize="38%"
                className="min-h-0 min-w-0"
              >
                {chatColumn}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                id="greenwood-browser"
                defaultSize="38%"
                minSize="22%"
                className="min-h-0 min-w-0"
              >
                <BrowserPanel onClose={() => setBrowserOpen(false)} />
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            chatColumn
          )}
        </div>
      </SidebarInset>

    </SidebarProvider>
  )
}

export default App
