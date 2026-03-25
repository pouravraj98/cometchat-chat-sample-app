import { useUserStore } from '../../store/userStore'
import Avatar from '../shared/Avatar'
import { formatTime } from '../../data/helpers'

export default function MessageInfoPanel({ message }) {
  const users = useUserStore((s) => s.users)
  const sender = users.find((u) => u.uid === message.sender)

  return (
    <div className="flex flex-col">
      {/* Message preview */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</h4>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Avatar src={sender?.avatar} name={sender?.name} size="sm" />
            <span className="text-xs font-medium text-gray-700">{sender?.name}</span>
          </div>
          <p className="text-sm text-gray-900">{message.text || `[${message.type}]`}</p>
        </div>
      </div>

      {/* Delivery info */}
      <div className="px-4 py-4 border-b border-gray-100 space-y-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery Info</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Sent</span>
          <span className="text-sm text-gray-900">{message.sentAt ? formatTime(message.sentAt) : '-'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Delivered</span>
          <span className="text-sm text-gray-900">{message.deliveredAt ? formatTime(message.deliveredAt) : '-'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Read</span>
          <span className="text-sm text-gray-900">{message.readAt ? formatTime(message.readAt) : '-'}</span>
        </div>
        {message.editedAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Edited</span>
            <span className="text-sm text-gray-900">{formatTime(message.editedAt)}</span>
          </div>
        )}
      </div>

      {/* Reactions */}
      {Object.keys(message.reactions || {}).length > 0 && (
        <div className="px-4 py-4 border-b border-gray-100">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reactions</h4>
          <div className="space-y-2">
            {Object.entries(message.reactions).map(([emoji, userIds]) => (
              <div key={emoji} className="flex items-center gap-2">
                <span className="text-lg">{emoji}</span>
                <div className="flex flex-wrap gap-1">
                  {userIds.map((uid) => {
                    const u = users.find((x) => x.uid === uid)
                    return (
                      <span key={uid} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        {u?.name || uid}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read by (for group messages) */}
      <div className="px-4 py-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Read By</h4>
        {message.readAt ? (
          <div className="flex items-center gap-2 py-1">
            <span className="text-blue-500 text-sm">✓✓</span>
            <span className="text-sm text-gray-600">Read at {formatTime(message.readAt)}</span>
          </div>
        ) : message.deliveredAt ? (
          <div className="flex items-center gap-2 py-1">
            <span className="text-gray-400 text-sm">✓✓</span>
            <span className="text-sm text-gray-600">Delivered at {formatTime(message.deliveredAt)}</span>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Not yet delivered</p>
        )}
      </div>
    </div>
  )
}
