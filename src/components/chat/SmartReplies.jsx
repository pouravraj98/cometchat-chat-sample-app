import { useMemo } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useMessageStore } from '../../store/messageStore'
import { useConversationStore } from '../../store/conversationStore'

const SMART_REPLIES_MAP = {
  meeting: ['Sounds good!', 'I\'ll be there', 'Can we reschedule?'],
  help: ['Sure, happy to help!', 'What do you need?', 'Let me check'],
  thanks: ['You\'re welcome!', 'No problem!', 'Anytime!'],
  question: ['Let me think about it', 'Good question', 'I\'ll get back to you'],
  default: ['Got it!', 'Sure thing', 'OK'],
}

export default function SmartReplies({ conversationId }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const rawMessages = useMessageStore((s) => s.messages[conversationId] || [])
  const sendMessage = useMessageStore((s) => s.sendMessage)
  const updateLastMessage = useConversationStore((s) => s.updateLastMessage)
  const messages = rawMessages

  const replies = useMemo(() => {
    const lastMsg = messages.filter((m) => !m.parentId && m.sender !== currentUser?.uid).pop()
    if (!lastMsg || lastMsg.type !== 'text') return null

    const text = lastMsg.text.toLowerCase()
    if (text.includes('meeting') || text.includes('tomorrow') || text.includes('schedule')) return SMART_REPLIES_MAP.meeting
    if (text.includes('help') || text.includes('need')) return SMART_REPLIES_MAP.help
    if (text.includes('thank') || text.includes('appreciate')) return SMART_REPLIES_MAP.thanks
    if (text.includes('?')) return SMART_REPLIES_MAP.question
    return SMART_REPLIES_MAP.default
  }, [rawMessages, currentUser])

  if (!replies) return null

  function handleReply(text) {
    const msg = { sender: currentUser.uid, type: 'text', text }
    const sent = sendMessage(conversationId, msg)
    updateLastMessage(conversationId, { ...sent, sentAt: new Date(sent.sentAt) })
  }

  return (
    <div className="px-4 py-1.5 bg-white flex gap-2 overflow-x-auto">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => handleReply(reply)}
          className="px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-full hover:bg-primary-100 transition-colors whitespace-nowrap shrink-0"
        >
          {reply}
        </button>
      ))}
    </div>
  )
}
