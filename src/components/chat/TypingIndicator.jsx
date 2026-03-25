import { useState, useEffect } from 'react'
import { useConversationStore } from '../../store/conversationStore'
import { useUserStore } from '../../store/userStore'

export default function TypingIndicator() {
  const activeConversationId = useConversationStore((s) => s.activeConversationId)
  const conversations = useConversationStore((s) => s.conversations)
  const users = useUserStore((s) => s.users)
  const [typing, setTyping] = useState(false)
  const [typer, setTyper] = useState(null)

  // Simulate random typing
  useEffect(() => {
    if (!activeConversationId) return
    const conv = conversations.find((c) => c.id === activeConversationId)
    if (!conv) return

    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const participantId = conv.type === 'user' ? conv.participantId : null
        if (participantId) {
          const user = users.find((u) => u.uid === participantId)
          if (user) {
            setTyper(user)
            setTyping(true)
            setTimeout(() => setTyping(false), 2500)
          }
        }
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [activeConversationId, conversations, users])

  if (!typing || !typer) return null

  return (
    <div className="px-4 py-1.5 bg-white">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{typer.name} is typing</span>
        <span className="flex gap-0.5">
          <span className="typing-dot w-1 h-1 bg-gray-400 rounded-full inline-block" />
          <span className="typing-dot w-1 h-1 bg-gray-400 rounded-full inline-block" />
          <span className="typing-dot w-1 h-1 bg-gray-400 rounded-full inline-block" />
        </span>
      </div>
    </div>
  )
}
