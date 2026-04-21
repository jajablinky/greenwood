import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { BatteryFull, ExpandIcon, Monitor, Signal, Wifi } from "assets/icons"

import {
  PhoneScreen,
  PhoneShell,
  PhoneSpeaker,
  Scaler,
  ScreenStack,
  IosStatusBar,
  IosStatusIcons,
  IosStatusTime,
} from "providers/MobilePreviewWrapper/styles"

import * as S from "./styles"

type Props = {
  previewHtml: string
  title: string
  /** Stable key so iframe remounts when HTML updates (e.g. mock agent patch). */
  previewKey?: string
  /** Hero on app detail (create/remix flow); `dialog` = create modal remix source preview. */
  variant?: "detail" | "dialog"
}

function DeviceStatusBar() {
  const iconProps = {
    width: 15,
    height: 15,
    strokeWidth: 2.5,
    "aria-hidden": true as const,
  }

  return (
    <IosStatusBar aria-hidden>
      <IosStatusTime>9:41</IosStatusTime>
      <IosStatusIcons>
        <Signal {...iconProps} />
        <Wifi {...iconProps} />
        <BatteryFull {...iconProps} width={17} height={17} />
      </IosStatusIcons>
    </IosStatusBar>
  )
}

export function AppPreviewPhoneExpand({
  previewHtml,
  title,
  previewKey,
  variant = "detail",
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const iframeKey = previewKey ?? String(previewHtml.length)

  const close = useCallback(() => {
    setExpanded(false)
  }, [])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [expanded, close])

  const Hit =
    variant === "dialog" ? S.CollapsedHitAreaDialog : S.CollapsedHitArea
  const Iframe =
    variant === "dialog" ? S.DialogCollapsedIframe : S.DetailCollapsedIframe

  const overlay =
    expanded &&
    createPortal(
      <S.ExpandOverlayRoot
        role="dialog"
        aria-modal="true"
        aria-label="Expanded app preview"
      >
        <S.ShrinkBar>
          <S.ShrinkButton
            type="button"
            onClick={close}
            aria-label="Close expanded preview"
          >
            <Monitor width={18} height={18} aria-hidden />
          </S.ShrinkButton>
        </S.ShrinkBar>
        <S.PhoneStage>
          <Scaler $preview>
            <PhoneShell $preview>
              <PhoneSpeaker $preview aria-hidden />
              <PhoneScreen $preview>
                <DeviceStatusBar />
                <ScreenStack>
                  <S.PhoneSrcDocIframe
                    key={iframeKey}
                    title={title}
                    srcDoc={previewHtml}
                    sandbox="allow-scripts"
                  />
                </ScreenStack>
              </PhoneScreen>
            </PhoneShell>
          </Scaler>
        </S.PhoneStage>
      </S.ExpandOverlayRoot>,
      document.body,
    )

  return (
    <>
      <Hit
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={`Expand preview: ${title}`}
        onClick={() => setExpanded(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setExpanded(true)
          }
        }}
      >
        <Iframe
          key={iframeKey}
          title={title}
          srcDoc={previewHtml}
          sandbox="allow-scripts"
        />
        <S.CollapsedHint aria-hidden>
          <ExpandIcon />
        </S.CollapsedHint>
      </Hit>
      {overlay}
    </>
  )
}
