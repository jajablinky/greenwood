import { Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "app/AppLayout"
import ActivityFeed from "views/ActivityFeed"
import AppDetail from "views/AppDetail"
import ProfilePage from "views/ProfilePage"

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ActivityFeed />} />
        <Route path="/notifications" element={<Navigate to="/profile" replace />} />
        <Route path="/profile/:author" element={<ProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/app/:feedId" element={<AppDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
