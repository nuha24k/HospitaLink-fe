import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "@/components/layout"
import Dashboard from "@/pages/dashboard"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
