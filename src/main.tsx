import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { AppTree } from "app/AppTree"
import { ArweaveProvider } from "providers/ArweaveProvider"
import { isDeviceFramePreview } from "helpers/device-frame-preview"
import { StyledComponentsRoot } from "providers/styled-components-root"
import { MobilePreviewWrapper } from "providers/MobilePreviewWrapper"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ArweaveProvider>
      <StyledComponentsRoot>
        {isDeviceFramePreview() ? (
          <AppTree />
        ) : (
          <MobilePreviewWrapper>
            <AppTree />
          </MobilePreviewWrapper>
        )}
      </StyledComponentsRoot>
    </ArweaveProvider>
  </StrictMode>
)
