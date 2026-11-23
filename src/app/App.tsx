import { BrowserRouter } from "react-router"
import { AppShell } from "./AppShell.tsx"
import { AppProviders } from "./providers.tsx"
import { AppRoutes } from "./routes.tsx"

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </BrowserRouter>
    </AppProviders>
  )
}
