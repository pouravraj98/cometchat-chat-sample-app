import { useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { useGroupStore } from '../../store/groupStore'
import { useConversationStore } from '../../store/conversationStore'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../shared/Avatar'
import PresenceBadge from '../shared/PresenceBadge'
import UnreadBadge from '../shared/UnreadBadge'
import { formatRelativeTime, truncate } from '../../data/helpers'

export default function ConversationItem({ conversation, isActive, onClick }) {
  const users = useUserStore((s) => s.users)
  const groups = useGroupStore((s) => s.groups)
  const pinConversation = useConversationStore((s) => s.pinConversation)
  const deleteConversation = useConversationStore((s) => s.deleteConversation)
  const currentUser = useAuthStore((s) => s.currentUser)
  const [showMenu, setShowMenu] = useState(false)

  const isUser = conversation.type === 'user'
  const participant = isUser
    ? users.find((u) => u.uid === conversation.participantId)
    : groups.find((g) => g.guid === conversation.participantId)

  if (!participant) return null

  const name = isUser ? participant.name : participant.name
  const avatar = isUser ? participant.avatar : participant.icon
  const status = isUser ? participant.status : null
  const lm = conversation.lastMessage
  const senderName = lm?.sender === currentUser?.uid ? 'You' : (users.find((u) => u.uid === lm?.sender)?.name?.split(' ')[0] || '')

  let preview = ''
  if (lm) {
    switch (lm.type) {
      case 'image': preview = '📷 Photo'; break
      case 'video': preview = '🎥 Video'; break
      case 'audio': preview = '🎵 Audio'; break
      case 'file': preview = '📎 File'; break
      case 'interactive': preview = '📊 Poll'; break
      case 'custom': preview = '💻 Code snippet'; break
      default: preview = truncate(lm.text, 35)
    }
    if (!isUser && senderName) preview = `${senderName}: ${preview}`
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors relative ${
        isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
      onContextMenu={(e) => { e.preventDefault(); setShowMenu(!showMenu) }}
    >
      <div className="relative">
        <Avatar src={avatar} name={name} size="md" />
        {status && <PresenceBadge status={status} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1.5">
            {conversation.pinned && <span className="text-gray-400 text-xs">📌</span>}
            {name}
          </span>
          <span className="text-xs text-gray-400 shrink-0 ml-2">
            {lm ? formatRelativeTime(lm.sentAt) : ''}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-gray-500 truncate">{preview}</span>
          <UnreadBadge count={conversation.unreadCount} />
        </div>
      </div>

      {/* Context menu */}
      {showMenu && (
        <div
          className="absolute right-2 top-full z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-36"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => { pinConversation(conversation.id); setShowMenu(false) }}
          >
            {conversation.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={() => { deleteConversation(conversation.id); setShowMenu(false) }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
