import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { LucideProvider } from "lucide-react"
import { HashRouter } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LucideProvider strokeWidth={1.5}>
      <TooltipProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </TooltipProvider>
    </LucideProvider>
  </StrictMode>
)
