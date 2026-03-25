import { useUserStore } from '../../store/userStore'
import { useMessageStore } from '../../store/messageStore'
import { useConversationStore } from '../../store/conversationStore'
import { useToast } from '../shared/Toast'
import Avatar from '../shared/Avatar'
import PresenceBadge from '../shared/PresenceBadge'
import SharedMediaPanel from './SharedMediaPanel'

export default function UserProfilePanel({ userId }) {
  const getUser = useUserStore((s) => s.getUser)
  const toggleBlock = useUserStore((s) => s.toggleBlock)
  const activeConversationId = useConversationStore((s) => s.activeConversationId)
  const toast = useToast()

  const user = getUser(userId)
  if (!user) return null

  function handleToggleBlock() {
    toggleBlock(userId)
    toast(user.blocked ? `${user.name} unblocked` : `${user.name} blocked`, 'info')
  }

  return (
    <div className="flex flex-col">
      {/* Avatar + name */}
      <div className="flex flex-col items-center py-6 border-b border-gray-100">
        <div className="relative mb-3">
          <Avatar src={user.avatar} name={user.name} size="xl" />
          <PresenceBadge status={user.status} size="lg" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
        <p className={`text-sm ${user.status === 'online' ? 'text-green-600' : 'text-gray-500'} capitalize`}>
          {user.status}
        </p>
      </div>

      {/* About */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h4>
        <p className="text-sm text-gray-700">{user.about || 'No bio set'}</p>
      </div>

      {/* Details */}
      <div className="px-4 py-4 border-b border-gray-100 space-y-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Role</span>
          <span className="text-sm text-gray-900 capitalize">{user.role}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Last Active</span>
          <span className="text-sm text-gray-900">
            {user.lastActiveAt?.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Shared Media */}
      <SharedMediaPanel conversationId={activeConversationId} />

      {/* Actions */}
      <div className="px-4 py-4">
        <button
          onClick={handleToggleBlock}
          className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${
            user.blocked
              ? 'text-green-700 bg-green-50 hover:bg-green-100'
              : 'text-red-700 bg-red-50 hover:bg-red-100'
          }`}
        >
          {user.blocked ? 'Unblock User' : 'Block User'}
        </button>
      </div>
    </div>
  )
}
