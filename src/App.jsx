import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DeckView from './pages/DeckView'
import StudySession from './pages/StudySession'
import NewDeck from './pages/NewDeck'
import Settings from './pages/Settings'
import ResetPassword from './pages/ResetPassword'
import './styles/globals.css'

function ProtectedLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl" style={{ animation: 'spin 1s linear infinite' }}>🃏</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  )
}

function PublicRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-deck" element={<NewDeck />} />
            <Route path="/deck/:id" element={<DeckView />} />
            <Route path="/deck/:id/study" element={<StudySession />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'Nunito, DM Sans, sans-serif',
            fontWeight: 600,
            borderRadius: '16px',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: { primary: '#86efac', secondary: 'white' },
          },
          error: {
            iconTheme: { primary: '#fca5a5', secondary: 'white' },
          },
        }}
      />
    </AuthProvider>
  )
}
