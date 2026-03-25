import { useState } from 'react'
import { useConversationStore } from '../../store/conversationStore'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageComposer from './MessageComposer'
import TypingIndicator from './TypingIndicator'
import SmartReplies from './SmartReplies'
import ThreadView from './ThreadView'
import MessageSearch from './MessageSearch'

export default function CenterPanel({ onOpenRightPanel, onMobileBack }) {
  const activeConversationId = useConversationStore((s) => s.activeConversationId)
  const [threadParent, setThreadParent] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [replyTo, setReplyTo] = useState(null)

  function handleOpenThread(message) {
    setThreadParent(message)
  }

  function handleCloseThread() {
    setThreadParent(null)
  }

  return (
    <div className="flex-1 flex min-w-0">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onOpenRightPanel={onOpenRightPanel}
          onToggleSearch={() => setShowSearch(!showSearch)}
          onBack={onMobileBack}
        />
        {showSearch && (
          <MessageSearch conversationId={activeConversationId} onClose={() => setShowSearch(false)} />
        )}
        <MessageList
          conversationId={activeConversationId}
          onOpenThread={handleOpenThread}
          onOpenRightPanel={onOpenRightPanel}
          onReply={setReplyTo}
        />
        <TypingIndicator />
        <SmartReplies conversationId={activeConversationId} />
        <MessageComposer
          conversationId={activeConversationId}
          replyTo={replyTo}
          onClearReply={() => setReplyTo(null)}
        />
      </div>

      {/* Thread side panel */}
      {threadParent && (
        <ThreadView
          conversationId={activeConversationId}
          parentMessage={threadParent}
          onClose={handleCloseThread}
        />
      )}
    </div>
  )
}
