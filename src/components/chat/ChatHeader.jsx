import { useConversationStore } from '../../store/conversationStore'
import { useUserStore } from '../../store/userStore'
import { useGroupStore } from '../../store/groupStore'
import Avatar from '../shared/Avatar'
import PresenceBadge from '../shared/PresenceBadge'

export default function ChatHeader({ onOpenRightPanel, onToggleSearch, onBack }) {
  const activeConversationId = useConversationStore((s) => s.activeConversationId)
  const conversations = useConversationStore((s) => s.conversations)
  const users = useUserStore((s) => s.users)
  const groups = useGroupStore((s) => s.groups)

  const conv = conversations.find((c) => c.id === activeConversationId)
  if (!conv) return null

  const isUser = conv.type === 'user'
  const participant = isUser
    ? users.find((u) => u.uid === conv.participantId)
    : groups.find((g) => g.guid === conv.participantId)

  if (!participant) return null

  const name = isUser ? participant.name : participant.name
  const avatar = isUser ? participant.avatar : participant.icon
  const subtitle = isUser
    ? participant.status === 'online' ? 'Online' : `Last seen ${participant.lastActiveAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : `${participant.membersCount} members`

  return (
    <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-white shrink-0">
      {/* Back button - visible only on mobile */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          title="Back to conversations"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div
        className="relative cursor-pointer"
        onClick={() => onOpenRightPanel(isUser ? 'profile' : 'groupInfo')}
      >
        <Avatar src={avatar} name={name} size="md" />
        {isUser && <PresenceBadge status={participant.status} />}
      </div>
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onOpenRightPanel(isUser ? 'profile' : 'groupInfo')}
      >
        <h2 className="text-sm font-semibold text-gray-900 truncate">{name}</h2>
        <p className={`text-xs ${isUser && participant.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleSearch}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          title="Search messages"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button
          onClick={() => onOpenRightPanel(isUser ? 'profile' : 'groupInfo')}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          title="Info"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
