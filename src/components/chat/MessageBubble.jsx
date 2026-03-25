import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useUserStore } from '../../store/userStore'
import Avatar from '../shared/Avatar'
import MessageReceipts from './MessageReceipts'
import MessageReactions from './MessageReactions'
import MessageActions from '../messages/MessageActions'
import TextMessage from './TextMessage'
import MediaMessage from './MediaMessage'
import CustomMessage from './CustomMessage'
import InteractiveMessage from './InteractiveMessage'
import ActionMessage from './ActionMessage'
import MentionText from './MentionText'
import { formatTime } from '../../data/helpers'

export default function MessageBubble({ message, conversationId, onOpenThread, onOpenRightPanel, onReply }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const getUser = useUserStore((s) => s.getUser)
  const [showActions, setShowActions] = useState(false)

  const isOwn = message.sender === currentUser?.uid
  const sender = getUser(message.sender)
  const isDeleted = !!message.deletedAt

  // Action messages are centered
  if (message.type === 'action') {
    return <ActionMessage message={message} />
  }

  // Deleted message
  if (isDeleted && message.deletedBy === 'everyone') {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} py-1`}>
        <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-400 text-sm italic">
          This message was deleted
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} py-1 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isOwn && (
        <Avatar src={sender?.avatar} name={sender?.name} size="sm" className="mt-1 mr-2 shrink-0" />
      )}
      <div className={`max-w-[65%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs font-medium text-gray-500 mb-0.5 ml-1">{sender?.name}</span>
        )}

        {/* Quoted reply */}
        {message.quotedMessage && (
          <div className="px-3 py-1.5 mb-1 rounded-lg bg-gray-200/60 border-l-2 border-primary-400 text-xs text-gray-600 max-w-full truncate">
            {message.quotedMessage.text || 'Media message'}
          </div>
        )}

        <div className="relative">
          <div
            className={`rounded-2xl overflow-hidden ${
              isOwn
                ? 'bg-primary-600 text-white rounded-br-md'
                : 'bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-md'
            }`}
          >
            {message.type === 'text' && (
              <div className="px-4 py-2">
                {message.mentions?.length > 0 ? (
                  <MentionText text={message.text} mentions={message.mentions} />
                ) : (
                  <TextMessage text={message.text} isOwn={isOwn} />
                )}
              </div>
            )}
            {(message.type === 'image' || message.type === 'video' || message.type === 'audio' || message.type === 'file') && (
              <MediaMessage message={message} isOwn={isOwn} />
            )}
            {message.type === 'custom' && <CustomMessage message={message} isOwn={isOwn} />}
            {message.type === 'interactive' && <InteractiveMessage message={message} conversationId={conversationId} />}
          </div>

          {/* Actions toolbar */}
          {showActions && !isDeleted && (
            <div className={`absolute ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-0 px-1`}>
              <MessageActions
                message={message}
                conversationId={conversationId}
                isOwn={isOwn}
                onOpenThread={onOpenThread}
                onOpenRightPanel={onOpenRightPanel}
                onReply={onReply}
              />
            </div>
          )}
        </div>

        {/* Footer: time + receipts + edited + thread */}
        <div className="flex items-center gap-1.5 mt-0.5 px-1">
          <span className="text-[10px] text-gray-400">{formatTime(message.sentAt)}</span>
          {message.editedAt && <span className="text-[10px] text-gray-400">(edited)</span>}
          {isOwn && <MessageReceipts message={message} />}
          {message.replyCount > 0 && (
            <button
              onClick={() => onOpenThread(message)}
              className="text-[10px] text-primary-600 font-medium hover:underline ml-1"
            >
              {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {/* Reactions */}
        {Object.keys(message.reactions || {}).length > 0 && (
          <MessageReactions message={message} conversationId={conversationId} />
        )}
      </div>
    </div>
  )
}
