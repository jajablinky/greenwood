import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"

import { Button } from "components/atoms/Button"
import { INITIAL_ACTIVITY_FEED } from "helpers/activity-feed-mock-data"
import { formatCount } from "helpers/format-count"
import {
  buildProfileHeaderForHandle,
  computeProfileStats,
} from "helpers/profile-mock-data"
import { profilePathForAuthor } from "helpers/profile-path"

import * as S from "./styles"

type Props = {
  handle: string
  children: ReactNode
}

const OPEN_DELAY_MS = 350
const CLOSE_DELAY_MS = 180
const VIEWPORT_MARGIN = 8

/**
 * Twitter-style profile preview card that opens on hover/focus of its children.
 * Uses a portal so it escapes `overflow: hidden` ancestors (feed cards, comment
 * rows). Disabled on touch/coarse-pointer devices and on very narrow mobile.
 */
export function ProfileHoverCard({ handle, children }: Props) {
  const wrapRef = useRef<HTMLSpanElement | null>(null)
  const popRef = useRef<HTMLDivElement | null>(null)
  const openTimer = useRef<number | null>(null)
  const closeTimer = useRef<number | null>(null)

  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [supportsHover, setSupportsHover] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = (matches: boolean) => setSupportsHover(matches)
    update(mq.matches)
    const onChange = (e: MediaQueryListEvent) => update(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const header = useMemo(() => buildProfileHeaderForHandle(handle), [handle])
  const stats = useMemo(
    () => computeProfileStats(handle, INITIAL_ACTIVITY_FEED),
    [handle],
  )
  const profileHref = useMemo(() => profilePathForAuthor(handle), [handle])

  const clearTimers = useCallback(() => {
    if (openTimer.current != null) {
      window.clearTimeout(openTimer.current)
      openTimer.current = null
    }
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const scheduleOpen = useCallback(() => {
    if (!supportsHover) return
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    if (open || openTimer.current != null) return
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null
      setOpen(true)
    }, OPEN_DELAY_MS)
  }, [open, supportsHover])

  const scheduleClose = useCallback(() => {
    // On touch/coarse pointers, synthetic mouseleave events can fire during a
    // tap and would eagerly dismiss the card. Dismissal there is driven by
    // tap-outside / Escape instead (see effect below).
    if (!supportsHover) return
    if (openTimer.current != null) {
      window.clearTimeout(openTimer.current)
      openTimer.current = null
    }
    if (closeTimer.current != null) return
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null
      setOpen(false)
    }, CLOSE_DELAY_MS)
  }, [supportsHover])

  const cancelClose = useCallback(() => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  // Position the popover against the trigger element. Flip above when there
  // isn't enough room below; clamp left/right to the viewport.
  useLayoutEffect(() => {
    if (!open || !popRef.current || !wrapRef.current) return
    const wrap = wrapRef.current
    // `display: contents` wrapper — use the first real element's rect.
    const firstChild = wrap.firstElementChild as HTMLElement | null
    const wrapRect = (firstChild ?? wrap).getBoundingClientRect()
    const popRect = popRef.current.getBoundingClientRect()
    const gap = 8
    const viewportW = window.innerWidth
    const viewportH = window.innerHeight
    const spaceBelow = viewportH - wrapRect.bottom
    const placeBelow =
      spaceBelow >= popRect.height + gap || wrapRect.top < popRect.height + gap
    const top = placeBelow
      ? wrapRect.bottom + gap
      : Math.max(VIEWPORT_MARGIN, wrapRect.top - popRect.height - gap)
    const rawLeft = wrapRect.left
    const left = Math.min(
      Math.max(VIEWPORT_MARGIN, rawLeft),
      viewportW - popRect.width - VIEWPORT_MARGIN,
    )
    setPos({ top, left })
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("scroll", close, true)
    window.addEventListener("resize", close)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("scroll", close, true)
      window.removeEventListener("resize", close)
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open) setPos(null)
  }, [open])

  // Touch devices: tap outside the card (and outside the trigger) closes it.
  // Deferred by a frame so the opening tap doesn't immediately close the card.
  useEffect(() => {
    if (!open || supportsHover) return
    let active = false
    const raf = window.requestAnimationFrame(() => {
      active = true
    })
    const onDocClick = (e: MouseEvent) => {
      if (!active) return
      const target = e.target as Node | null
      if (target == null) return
      if (popRef.current?.contains(target)) return
      if (wrapRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener("click", onDocClick)
    return () => {
      window.cancelAnimationFrame(raf)
      document.removeEventListener("click", onDocClick)
    }
  }, [open, supportsHover])

  const triggerHandlers = {
    onMouseEnter: scheduleOpen,
    onMouseLeave: scheduleClose,
    onFocus: scheduleOpen,
    onBlur: scheduleClose,
  } as const

  /**
   * Touch fallback: tapping the trigger on a coarse-pointer device swallows the
   * normal link navigation and opens the preview instead. A second tap closes
   * it again. Desktop (hover:hover) keeps its native link behaviour.
   */
  const onTriggerClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (supportsHover) return
      e.preventDefault()
      e.stopPropagation()
      setOpen((prev) => !prev)
    },
    [supportsHover],
  )

  return (
    <>
      <S.HoverTriggerWrap
        ref={wrapRef}
        {...triggerHandlers}
        onClick={onTriggerClick}
      >
        {children}
      </S.HoverTriggerWrap>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <S.HoverCard
            ref={popRef}
            role="dialog"
            aria-label={`${header.displayName} profile preview`}
            $top={pos?.top ?? -9999}
            $left={pos?.left ?? -9999}
            $ready={pos != null}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <S.HoverOverlayLink
              href={`#${profileHref}`}
              aria-label={`View ${header.displayName}'s profile`}
              tabIndex={-1}
            />
            <S.HoverTopRow>
              <S.HoverAvatar $hue={header.accentHue} aria-hidden>
                {header.initials}
              </S.HoverAvatar>
              <S.HoverFollowSlot>
                <Button type="button" variant="accent" size="sm">
                  Follow
                </Button>
              </S.HoverFollowSlot>
            </S.HoverTopRow>

            <S.HoverIdentity>
              <S.HoverNameRow>
                <S.HoverName href={`#${profileHref}`}>
                  {header.displayName}
                </S.HoverName>
                {header.verified ? (
                  <S.HoverVerifiedDot
                    aria-label="Verified builder"
                    role="img"
                  />
                ) : null}
              </S.HoverNameRow>
              {header.handle ? (
                <S.HoverHandle href={`#${profileHref}`}>
                  @{header.handle}
                </S.HoverHandle>
              ) : null}
            </S.HoverIdentity>

            <S.HoverBio>{header.bio}</S.HoverBio>

            <S.HoverFollowRow>
              <S.HoverFollowItem>
                <S.HoverFollowValue>
                  {formatCount(stats.following)}
                </S.HoverFollowValue>
                Following
              </S.HoverFollowItem>
              <S.HoverFollowItem>
                <S.HoverFollowValue>
                  {formatCount(stats.followers)}
                </S.HoverFollowValue>
                Followers
              </S.HoverFollowItem>
              <S.HoverFollowItem>
                <S.HoverFollowValue>{formatCount(stats.apps)}</S.HoverFollowValue>
                Apps
              </S.HoverFollowItem>
            </S.HoverFollowRow>
          </S.HoverCard>,
          document.body,
        )}
    </>
  )
}
