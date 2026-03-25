import { useRef, useEffect, useMemo } from 'react'
import { useMessageStore } from '../../store/messageStore'
import MessageBubble from './MessageBubble'
import { formatDate } from '../../data/helpers'
import EmptyState from '../shared/EmptyState'

export default function MessageList({ conversationId, onOpenThread, onOpenRightPanel, onReply }) {
  const rawMessages = useMessageStore((s) => s.messages[conversationId] || [])
  const messages = rawMessages.map((m) => ({
    ...m,
    sentAt: new Date(m.sentAt),
    editedAt: m.editedAt ? new Date(m.editedAt) : null,
    deletedAt: m.deletedAt ? new Date(m.deletedAt) : null,
    readAt: m.readAt ? new Date(m.readAt) : null,
    deliveredAt: m.deliveredAt ? new Date(m.deliveredAt) : null,
  }))
  const endRef = useRef(null)

  // Only top-level messages (no thread replies)
  const topLevel = useMemo(
    () => messages.filter((m) => !m.parentId),
    [messages]
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [topLevel.length])

  if (topLevel.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <EmptyState title="No messages yet" description="Send a message to start the conversation" />
      </div>
    )
  }

  // Group messages by date
  const grouped = []
  let lastDate = ''
  for (const msg of topLevel) {
    const dateStr = formatDate(msg.sentAt)
    if (dateStr !== lastDate) {
      grouped.push({ type: 'date', date: dateStr })
      lastDate = dateStr
    }
    grouped.push({ type: 'message', message: msg })
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 bg-gray-50 space-y-1">
      {grouped.map((item, i) =>
        item.type === 'date' ? (
          <div key={`date-${i}`} className="flex items-center justify-center py-3">
            <span className="px-3 py-1 bg-white text-xs font-medium text-gray-500 rounded-full shadow-sm border border-gray-100">
              {item.date}
            </span>
          </div>
        ) : (
          <MessageBubble
            key={item.message.id}
            message={item.message}
            conversationId={conversationId}
            onOpenThread={onOpenThread}
            onOpenRightPanel={onOpenRightPanel}
            onReply={onReply}
          />
        )
      )}
      <div ref={endRef} />
    </div>
  )
}
