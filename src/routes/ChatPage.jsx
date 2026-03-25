import { ToastProvider } from '../components/shared/Toast'
import AppShell from '../components/layout/AppShell'

export default function ChatPage() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  )
}
