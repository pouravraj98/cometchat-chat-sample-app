import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useMessageStore } from '../../store/messageStore'
import { useUserStore } from '../../store/userStore'
import Avatar from '../shared/Avatar'
import { formatTime } from '../../data/helpers'

export default function ThreadView({ conversationId, parentMessage, onClose }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const getThreadMessages = useMessageStore((s) => s.getThreadMessages)
  const sendMessage = useMessageStore((s) => s.sendMessage)
  const getUser = useUserStore((s) => s.getUser)
  const [text, setText] = useState('')
  const endRef = useRef(null)

  const threadMessages = getThreadMessages(conversationId, parentMessage.id)
  const parentSender = getUser(parentMessage.sender)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadMessages.length])

  function handleSend() {
    if (!text.trim()) return
    sendMessage(conversationId, {
      sender: currentUser.uid,
      type: 'text',
      text: text.trim(),
      parentId: parentMessage.id,
    })
    setText('')
  }

  return (
    <div className="fixed inset-0 z-40 md:static md:inset-auto md:z-auto w-full md:w-80 border-l border-gray-200 flex flex-col bg-white shrink-0">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Thread</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Parent message */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-start gap-2">
          <Avatar src={parentSender?.avatar} name={parentSender?.name} size="sm" />
          <div>
            <span className="text-xs font-medium text-gray-700">{parentSender?.name}</span>
            <p className="text-sm text-gray-900 mt-0.5">{parentMessage.text}</p>
            <span className="text-[10px] text-gray-400">{formatTime(parentMessage.sentAt)}</span>
          </div>
        </div>
      </div>

      {/* Thread messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3">
        {threadMessages.map((msg) => {
          const sender = getUser(msg.sender)
          const isOwn = msg.sender === currentUser?.uid
          return (
            <div key={msg.id} className="flex items-start gap-2">
              <Avatar src={sender?.avatar} name={sender?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-gray-700">{sender?.name}</span>
                  <span className="text-[10px] text-gray-400">{formatTime(msg.sentAt)}</span>
                </div>
                <p className="text-sm text-gray-900 mt-0.5">{msg.text}</p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {/* Thread composer */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Reply in thread..."
            className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
