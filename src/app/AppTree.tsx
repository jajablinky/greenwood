import { HashRouter } from "react-router-dom"

import App from "app/App"
import { ProjectsProvider } from "providers/ProjectsProvider"
import { ToasterProvider } from "providers/ToasterProvider"
import { ViewerActivityProvider } from "providers/ViewerActivityProvider"
import { TooltipProvider } from "components/atoms/Tooltip"

/** Shared app shell (used with or without `MobilePreviewWrapper`). */
export function AppTree() {
  return (
    <ToasterProvider>
      <ProjectsProvider>
        <ViewerActivityProvider>
          <TooltipProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </TooltipProvider>
        </ViewerActivityProvider>
      </ProjectsProvider>
    </ToasterProvider>
  )
}
