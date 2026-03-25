import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
  }, [])

  const colors = {
    info: 'bg-gray-800',
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
  }

  return (
    <div
      className={`${colors[toast.type] || colors.info} text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center gap-2 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="text-white/70 hover:text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
