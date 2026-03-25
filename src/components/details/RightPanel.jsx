import { useConversationStore } from '../../store/conversationStore'
import { useUserStore } from '../../store/userStore'
import { useGroupStore } from '../../store/groupStore'
import UserProfilePanel from './UserProfilePanel'
import GroupInfoPanel from './GroupInfoPanel'
import MessageInfoPanel from './MessageInfoPanel'

export default function RightPanel({ type, data, onClose }) {
  const activeConversationId = useConversationStore((s) => s.activeConversationId)
  const conversations = useConversationStore((s) => s.conversations)
  const users = useUserStore((s) => s.users)
  const groups = useGroupStore((s) => s.groups)

  const conv = conversations.find((c) => c.id === activeConversationId)

  return (
    <div className="fixed inset-0 z-50 md:static md:inset-auto md:z-auto w-full md:w-[340px] border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-y-auto scrollbar-thin">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">
          {type === 'profile' && 'User Profile'}
          {type === 'groupInfo' && 'Group Info'}
          {type === 'messageInfo' && 'Message Info'}
        </h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {type === 'profile' && conv?.type === 'user' && (
        <UserProfilePanel userId={conv.participantId} />
      )}
      {type === 'groupInfo' && conv?.type === 'group' && (
        <GroupInfoPanel groupId={conv.participantId} />
      )}
      {type === 'messageInfo' && data && (
        <MessageInfoPanel message={data} />
      )}
    </div>
  )
}
