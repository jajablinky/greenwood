"use client"

import * as React from "react"
import { Undo2Icon, UserRoundIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { MergedThreadMessage } from "@/lib/greenwood-mock-data"
import { cn } from "@/lib/utils"

function splitByTokens(text: string): { type: "text" | "code" | "url"; value: string }[] {
  const re = /(`[^`]+`)|(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g
  const out: { type: "text" | "code" | "url"; value: string }[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      out.push({ type: "text", value: text.slice(last, m.index) })
    }
    if (m[1]) {
      out.push({ type: "code", value: m[1].slice(1, -1) })
    } else if (m[2]) {
      out.push({ type: "url", value: m[2] })
    }
    last = m.index + m[0].length
  }
  if (last < text.length) {
    out.push({ type: "text", value: text.slice(last) })
  }
  return out.length ? out : [{ type: "text", value: text }]
}

function RichLine({ line }: { line: string }) {
  if (!line) {
    return <br />
  }
  const parts = splitByTokens(line)
  return (
    <span>
      {parts.map((p, i) => {
        if (p.type === "url") {
          return (
            <a
              key={i}
              href={p.value}
              target="_blank"
              rel="noreferrer"
              className="text-[#2563eb] underline decoration-[#2563eb]/40 underline-offset-2 hover:decoration-[#2563eb]"
            >
              {p.value}
            </a>
          )
        }
        if (p.type === "code") {
          return (
            <code
              key={i}
              className="rounded bg-black/[0.06] px-1 py-px font-mono text-[0.75rem] leading-tight text-foreground/90 dark:bg-white/10"
            >
              {p.value}
            </code>
          )
        }
        return <React.Fragment key={i}>{p.value}</React.Fragment>
      })}
    </span>
  )
}

function AssistantBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n\n+/)
  return (
    <div className="text-[13px] leading-normal text-foreground/90">
      {paragraphs.map((para, pi) => (
        <p key={pi} className="mb-2 last:mb-0">
          {para.split("\n").map((line, li) => (
            <React.Fragment key={li}>
              {li > 0 ? <br /> : null}
              <RichLine line={line} />
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  )
}

export function ChatTranscript({
  messages,
  selectedForkId,
  onRevertToMessage,
  className,
}: {
  messages: MergedThreadMessage[]
  /** Scroll this fork’s first block into view when it changes (sidebar selection). */
  selectedForkId?: string
  /** Trim the thread to end at this message (inclusive), e.g. restore fork state to this point. */
  onRevertToMessage?: (messageId: string) => void
  className?: string
}) {
  React.useEffect(() => {
    if (!selectedForkId) {
      return
    }
    const id = `chat-fork-${selectedForkId}`
    const t = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    })
    return () => cancelAnimationFrame(t)
  }, [selectedForkId, messages])

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      {messages.map((msg, index) => {
        const isLast = index === messages.length - 1
        const showRevert = Boolean(onRevertToMessage) && !isLast
        const prevForkId = index > 0 ? messages[index - 1]?.forkId : undefined
        const isForkHead =
          Boolean(msg.forkId) && msg.forkId !== prevForkId
        const forkAnchorId =
          isForkHead && msg.forkId ? `chat-fork-${msg.forkId}` : undefined

        if (msg.role === "user") {
          return (
            <div
              key={msg.id}
              id={forkAnchorId}
              className="w-full scroll-mt-4 py-2"
            >
              <div className="flex w-full items-center gap-3">
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                  aria-hidden
                >
                  <UserRoundIcon className="size-3.5 stroke-[1.5]" />
                </div>
                <div className="min-w-0 flex-1 self-center text-pretty text-[13px] leading-normal text-foreground">
                  <p className="m-0 whitespace-pre-wrap break-words">{msg.body}</p>
                </div>
                {showRevert ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 shrink-0 self-center rounded-lg text-muted-foreground hover:bg-black/[0.06] hover:text-foreground dark:hover:bg-white/10"
                    title="Revert fork to this point in the chat"
                    aria-label="Revert fork to this point in the chat"
                    onClick={() => onRevertToMessage?.(msg.id)}
                  >
                    <Undo2Icon className="size-3.5" />
                  </Button>
                ) : null}
              </div>
            </div>
          )
        }
        return (
          <div key={msg.id} id={forkAnchorId} className="w-full scroll-mt-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Worked for {msg.workedSeconds}s
              </p>
              <AssistantBody body={msg.body} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
