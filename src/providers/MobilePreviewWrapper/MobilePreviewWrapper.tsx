import { useCallback, useId, useRef, useState } from "react"
import { BatteryFull, Monitor, Signal, Smartphone, Wifi } from "assets/icons"

import { buildDeviceFramePreviewUrl } from "helpers/device-frame-preview"

import {
  IosStatusBar,
  IosStatusIcons,
  IosStatusTime,
  Outer,
  PhoneScreen,
  PhoneShell,
  PhoneSpeaker,
  PreviewIframe,
  Scaler,
  ScreenInner,
  ScreenStack,
  ToggleButton,
} from "./styles"

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

export function MobilePreviewWrapper({ children }: { children: React.ReactNode }) {
  const [mobilePreview, setMobilePreview] = useState(false)
  const [frameSrc, setFrameSrc] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const labelId = useId()

  const toggle = useCallback(() => {
    if (mobilePreview) {
      const win = iframeRef.current?.contentWindow
      if (win) {
        try {
          const h = win.location.hash
          if (h) {
            window.location.hash = h
          }
        } catch {
          /* ignore */
        }
      }
      setFrameSrc(null)
      setMobilePreview(false)
    } else {
      setFrameSrc(buildDeviceFramePreviewUrl())
      setMobilePreview(true)
    }
  }, [mobilePreview])

  const showFrame = mobilePreview && frameSrc

  return (
    <>
      <Outer $preview={mobilePreview}>
        <Scaler $preview={mobilePreview}>
          <PhoneShell $preview={mobilePreview}>
            <PhoneSpeaker $preview={mobilePreview} aria-hidden />
            <PhoneScreen $preview={mobilePreview}>
              {mobilePreview ? (
                <>
                  <DeviceStatusBar />
                  <ScreenStack>
                    {showFrame ? (
                      <PreviewIframe
                        ref={iframeRef}
                        src={frameSrc}
                        title="Mobile viewport preview"
                      />
                    ) : (
                      <ScreenInner $preview={mobilePreview}>{children}</ScreenInner>
                    )}
                  </ScreenStack>
                </>
              ) : (
                <ScreenInner $preview={mobilePreview}>{children}</ScreenInner>
              )}
            </PhoneScreen>
          </PhoneShell>
        </Scaler>
      </Outer>
      <ToggleButton
        type="button"
        onClick={toggle}
        aria-pressed={mobilePreview}
        aria-labelledby={labelId}
      >
        {mobilePreview ? (
          <Monitor width={18} height={18} aria-hidden />
        ) : (
          <Smartphone width={18} height={18} aria-hidden />
        )}
        <span id={labelId}>{mobilePreview ? "Exit phone" : "Phone preview"}</span>
      </ToggleButton>
    </>
  )
}
