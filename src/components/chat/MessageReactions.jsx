import { useAuthStore } from '../../store/authStore'
import { useMessageStore } from '../../store/messageStore'

export default function MessageReactions({ message, conversationId }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const toggleReaction = useMessageStore((s) => s.toggleReaction)

  const reactions = message.reactions || {}

  return (
    <div className="flex flex-wrap gap-1 mt-1 px-1">
      {Object.entries(reactions).map(([emoji, users]) => {
        const isReacted = users.includes(currentUser?.uid)
        return (
          <button
            key={emoji}
            onClick={() => toggleReaction(conversationId, message.id, emoji, currentUser?.uid)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
              isReacted
                ? 'bg-primary-100 border border-primary-300 text-primary-700'
                : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{emoji}</span>
            <span className="font-medium">{users.length}</span>
          </button>
        )
      })}
    </div>
  )
}
