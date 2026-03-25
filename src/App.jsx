import { HashRouter, Routes, Route, Navigate } from 'react-router'
import { useAuthStore } from './store/authStore'
import LoginPage from './routes/LoginPage'
import ChatPage from './routes/ChatPage'

function ProtectedRoute({ children }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  if (!currentUser) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  )
}
