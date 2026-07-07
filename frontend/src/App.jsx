import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import TasksPage from './pages/TasksPage'
import AnalyticsPage from './pages/AnalyticsPage'
import TeamPage from './pages/TeamPage'
import InboxPage from './pages/InboxPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  const { fetchUser, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser()
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />

        {/* Private Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>
        } />
        <Route path="/projects" element={
          <PrivateRoute><Layout><ProjectsPage /></Layout></PrivateRoute>
        } />
        <Route path="/tasks" element={
          <PrivateRoute><Layout><TasksPage /></Layout></PrivateRoute>
        } />
        <Route path="/analytics" element={
          <PrivateRoute><Layout><AnalyticsPage /></Layout></PrivateRoute>
        } />
        <Route path="/team" element={
          <PrivateRoute><Layout><TeamPage /></Layout></PrivateRoute>
        } />
        <Route path="/inbox" element={
          <PrivateRoute><Layout><InboxPage /></Layout></PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute><Layout><SettingsPage /></Layout></PrivateRoute>
        } />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}