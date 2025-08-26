import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "@/components/layout"
import Dashboard from "@/pages/dashboard"
import Patient from "@/pages/patien"
import Login from "@/pages/login"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient" element={<Patient />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
