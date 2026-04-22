import { Outlet } from "react-router-dom"

import { MobileAppShellBody, MobileTabBar } from "components/molecules/MobileTabBar"
import { MobileScrollChromeProvider } from "providers/MobileScrollChrome"

export function AppLayout() {
  return (
    <MobileScrollChromeProvider>
      <MobileAppShellBody>
        <Outlet />
      </MobileAppShellBody>
      <MobileTabBar />
    </MobileScrollChromeProvider>
  )
}
