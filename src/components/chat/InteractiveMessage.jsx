import { useAuthStore } from '../../store/authStore'
import { useMessageStore } from '../../store/messageStore'

export default function InteractiveMessage({ message, conversationId }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const voteOnPoll = useMessageStore((s) => s.voteOnPoll)

  if (message.interactiveType === 'poll') {
    const totalVotes = message.options.reduce((sum, opt) => sum + opt.voters.length, 0)
    const userVoted = message.options.find((opt) => opt.voters.includes(currentUser?.uid))

    return (
      <div className="px-4 py-3 min-w-56">
        <p className="text-sm font-medium mb-3">{message.text}</p>
        <div className="space-y-2">
          {message.options.map((opt) => {
            const pct = totalVotes > 0 ? Math.round((opt.voters.length / totalVotes) * 100) : 0
            const isVoted = opt.voters.includes(currentUser?.uid)
            return (
              <button
                key={opt.id}
                onClick={() => voteOnPoll(conversationId, message.id, opt.id, currentUser?.uid)}
                className={`w-full text-left relative rounded-lg overflow-hidden border transition-colors ${
                  isVoted ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div
                  className="absolute inset-0 bg-primary-100 transition-all"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative px-3 py-2 flex items-center justify-between">
                  <span className="text-sm text-gray-800">{opt.text}</span>
                  <span className="text-xs text-gray-500 font-medium ml-2">{pct}%</span>
                </div>
              </button>
            )
          })}
        </div>
        <p className="text-[10px] text-gray-400 mt-2">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</p>
      </div>
    )
  }

  // Form/Card interactive messages
  return (
    <div className="px-4 py-3">
      <p className="text-sm font-medium mb-2">{message.text || 'Interactive Message'}</p>
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-500">
        Interactive content
      </div>
    </div>
  )
}
