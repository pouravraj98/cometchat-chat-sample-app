import { useState, useMemo } from 'react'
import { useMessageStore } from '../../store/messageStore'
import { useUserStore } from '../../store/userStore'
import { useDebounce } from '../../hooks/useDebounce'
import { formatTime } from '../../data/helpers'

export default function MessageSearch({ conversationId, onClose }) {
  const rawMessages = useMessageStore((s) => s.messages[conversationId] || [])
  const getUser = useUserStore((s) => s.getUser)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const results = useMemo(() => {
    if (!debouncedQuery) return []
    const q = debouncedQuery.toLowerCase()
    return rawMessages
      .filter((m) => m.type === 'text' && m.text.toLowerCase().includes(q))
      .reverse()
      .slice(0, 20)
  }, [debouncedQuery, rawMessages])

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-4 py-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search in conversation..."
          className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-400"
          autoFocus
        />
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {debouncedQuery && (
        <div className="max-h-48 overflow-y-auto border-t border-gray-100">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">No messages found</p>
          ) : (
            results.map((msg) => {
              const sender = getUser(msg.sender)
              return (
                <div key={msg.id} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">{sender?.name}</span>
                    <span className="text-[10px] text-gray-400">{formatTime(msg.sentAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{msg.text}</p>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
