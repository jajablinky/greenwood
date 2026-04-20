import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { LucideProvider } from "lucide-react"
import { HashRouter } from "react-router-dom"

import "./index.css"
import App from "app/App"
import { ArweaveProvider } from "providers/ArweaveProvider"
import { ProjectsProvider } from "providers/ProjectsProvider"
import { StyledComponentsRoot } from "providers/styled-components-root"
import { ToasterProvider } from "providers/ToasterProvider"
import { TooltipProvider } from "components/atoms/Tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ArweaveProvider>
      <StyledComponentsRoot>
        <ToasterProvider>
          <ProjectsProvider>
            <LucideProvider strokeWidth={1.5}>
              <TooltipProvider>
                <HashRouter>
                  <App />
                </HashRouter>
              </TooltipProvider>
            </LucideProvider>
          </ProjectsProvider>
        </ToasterProvider>
      </StyledComponentsRoot>
    </ArweaveProvider>
  </StrictMode>
)
