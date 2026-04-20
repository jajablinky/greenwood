import { useEffect } from "react"

/** Matches `MobileTabBar` / layout mobile breakpoint. */
const MOBILE_MQ = "(max-width: 639.98px)"

const DATA_ATTR = "mobileChromeHidden"

function setChromeHidden(hidden: boolean) {
  if (hidden) {
    document.documentElement.dataset[DATA_ATTR] = "true"
  } else {
    delete document.documentElement.dataset[DATA_ATTR]
  }
}

/**
 * On narrow viewports, hides the sticky app header and bottom tab bar while the user
 * scrolls down; shows them again on scroll up or when near the top of the page.
 */
export function MobileScrollChromeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    let lastY = window.scrollY

    const sync = () => {
      if (!mq.matches) {
        setChromeHidden(false)
        lastY = window.scrollY
        return
      }

      const y = window.scrollY
      const delta = y - lastY
      const topRevealPx = 14
      const dirThreshold = 4
      const minHideScroll = 36

      if (y <= topRevealPx) {
        setChromeHidden(false)
      } else if (delta > dirThreshold && y > minHideScroll) {
        setChromeHidden(true)
      } else if (delta < -dirThreshold) {
        setChromeHidden(false)
      }

      lastY = y
    }

    const onScroll = () => {
      sync()
    }

    const onMqChange = () => {
      lastY = window.scrollY
      if (!mq.matches) {
        setChromeHidden(false)
      }
    }

    lastY = window.scrollY
    if (!mq.matches) {
      setChromeHidden(false)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    mq.addEventListener("change", onMqChange)

    return () => {
      window.removeEventListener("scroll", onScroll)
      mq.removeEventListener("change", onMqChange)
      setChromeHidden(false)
    }
  }, [])

  return children
}
