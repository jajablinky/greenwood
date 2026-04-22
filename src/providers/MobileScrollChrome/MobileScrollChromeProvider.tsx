import { useEffect } from "react"

const DATA_ATTR = "mobileChromeHidden"

function setChromeHidden(hidden: boolean) {
  if (hidden) {
    document.documentElement.dataset[DATA_ATTR] = "true"
  } else {
    delete document.documentElement.dataset[DATA_ATTR]
  }
}

/**
 * Tracks scroll direction across all viewports and toggles `html[data-mobile-chrome-hidden]`.
 * Consumers decide where to react — on mobile this hides the tab bar and app detail header;
 * on desktop the feed uses it to slide the brand row off while keeping the sort tabs pinned.
 */
export function MobileScrollChromeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lastY = window.scrollY

    const sync = () => {
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

    lastY = window.scrollY

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      setChromeHidden(false)
    }
  }, [])

  return children
}
