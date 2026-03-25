import { useState, useMemo } from 'react'
import { useConversationStore } from '../../store/conversationStore'
import { useUserStore } from '../../store/userStore'
import { useGroupStore } from '../../store/groupStore'
import SearchInput from '../shared/SearchInput'
import ConversationItem from './ConversationItem'
import EmptyState from '../shared/EmptyState'

export default function ConversationList() {
  const conversations = useConversationStore((s) => s.conversations)
  const activeConversationId = useConversationStore((s) => s.activeConversationId)
  const setActive = useConversationStore((s) => s.setActive)
  const users = useUserStore((s) => s.users)
  const groups = useGroupStore((s) => s.groups)
  const [search, setSearch] = useState('')

  const sorted = useMemo(() => {
    let list = [...conversations]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((c) => {
        if (c.type === 'user') {
          const u = users.find((u) => u.uid === c.participantId)
          return u?.name.toLowerCase().includes(q)
        }
        const g = groups.find((g) => g.guid === c.participantId)
        return g?.name.toLowerCase().includes(q)
      })
    }
    // Pinned first, then by updatedAt
    list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
    return list
  }, [conversations, search, users, groups])

  return (
    <div>
      <div className="p-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search conversations..." />
      </div>
      {sorted.length === 0 ? (
        <EmptyState title="No conversations" description="Start a new chat from the Users or Groups tab" />
      ) : (
        <div>
          {sorted.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => setActive(conv.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
