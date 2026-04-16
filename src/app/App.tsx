import { Navigate, Route, Routes } from "react-router-dom"

import ActivityFeed from "views/ActivityFeed"
import AppDetail from "views/AppDetail"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ActivityFeed />} />
      <Route path="/app/:feedId" element={<AppDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
