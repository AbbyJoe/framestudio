import { Navigate, Route, Routes, useParams } from "react-router"
import { ContentDetailScreen } from "../features/content-library/ContentDetailScreen.tsx"
import { LibraryScreen } from "../features/content-library/LibraryScreen.tsx"

/** Keeps old `/content/:id` links working during review. */
function LegacyContentRedirect() {
  const { id } = useParams()
  return <Navigate to={`/contents/${id}`} replace />
}

/** The router itself lives in App.tsx, so tests can render these routes inside a MemoryRouter. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LibraryScreen />} />
      <Route path="/contents/:id" element={<ContentDetailScreen />} />
      <Route path="/content/:id" element={<LegacyContentRedirect />} />
    </Routes>
  )
}
