import { useMemo } from 'react'
import { useMessageStore } from '../../store/messageStore'

export default function SharedMediaPanel({ conversationId }) {
  const rawMessages = useMessageStore((s) => s.messages[conversationId] || [])

  const media = useMemo(
    () => rawMessages.filter((m) => m.type === 'image' || m.type === 'video' || m.type === 'file'),
    [rawMessages]
  )

  if (media.length === 0) return null

  return (
    <div className="px-4 py-4 border-b border-gray-100">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shared Media</h4>
      <div className="grid grid-cols-3 gap-1.5">
        {media.slice(0, 9).map((m) => (
          <div key={m.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            {m.type === 'image' ? (
              <img src={m.url} alt={m.fileName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[9px] text-gray-500 text-center truncate w-full">{m.fileName}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {media.length > 9 && (
        <p className="text-xs text-primary-600 font-medium mt-2 cursor-pointer hover:underline">
          View all ({media.length})
        </p>
      )}
    </div>
  )
}
