import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useMessageStore } from '../../store/messageStore'
import { useToast } from '../shared/Toast'
import EditMessageModal from './EditMessageModal'
import DeleteMessageModal from './DeleteMessageModal'
import ForwardMessageModal from './ForwardMessageModal'
import ReactionPicker from './ReactionPicker'

export default function MessageActions({ message, conversationId, isOwn, onOpenThread, onOpenRightPanel, onReply }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const toggleReaction = useMessageStore((s) => s.toggleReaction)
  const toast = useToast()
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showForward, setShowForward] = useState(false)
  const [showReactions, setShowReactions] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(message.text || '')
    toast('Message copied to clipboard', 'success')
  }

  function handleReaction(emoji) {
    toggleReaction(conversationId, message.id, emoji, currentUser?.uid)
    setShowReactions(false)
  }

  return (
    <>
      <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-sm p-0.5">
        <button onClick={() => onReply(message)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Reply">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <div className="relative">
          <button onClick={() => setShowReactions(!showReactions)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="React">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {showReactions && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1">
              <ReactionPicker onSelect={handleReaction} onClose={() => setShowReactions(false)} />
            </div>
          )}
        </div>
        <button onClick={() => onOpenThread(message)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Thread">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
        {isOwn && message.type === 'text' && (
          <button onClick={() => setShowEdit(true)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Edit">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        <button onClick={() => setShowDelete(true)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Delete">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button onClick={() => setShowForward(true)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Forward">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        {message.type === 'text' && (
          <button onClick={handleCopy} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Copy">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        )}
        <button onClick={() => onOpenRightPanel('messageInfo', message)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Info">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <EditMessageModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        message={message}
        conversationId={conversationId}
      />
      <DeleteMessageModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        message={message}
        conversationId={conversationId}
        isOwn={isOwn}
      />
      <ForwardMessageModal
        open={showForward}
        onClose={() => setShowForward(false)}
        message={message}
      />
    </>
  )
}
