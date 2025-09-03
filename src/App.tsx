import { Routes, Route, Navigate } from "react-router-dom"
import React from "react"
import authService from "@/services/authService"
import Layout from "@/components/layout"
import Dashboard from "@/pages/dashboard"
import Login from "@/pages/login"
import Chart from "@/pages/chart"
import Register from "@/pages/register"
import User from "@/pages/userPage"

function RequireAuth({ children }: { children: React.ReactElement }) {
  const token = authService.getToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/user" element={<RequireAuth><User /></RequireAuth>} />
        <Route path="/chart" element={<RequireAuth><Chart /></RequireAuth>} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
