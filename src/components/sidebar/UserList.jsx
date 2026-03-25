import { useState, useMemo } from 'react'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import { useConversationStore } from '../../store/conversationStore'
import SearchInput from '../shared/SearchInput'
import Avatar from '../shared/Avatar'
import PresenceBadge from '../shared/PresenceBadge'

export default function UserList() {
  const users = useUserStore((s) => s.users)
  const currentUser = useAuthStore((s) => s.currentUser)
  const conversations = useConversationStore((s) => s.conversations)
  const setActive = useConversationStore((s) => s.setActive)
  const addConversation = useConversationStore((s) => s.addConversation)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const others = users.filter((u) => u.uid !== currentUser?.uid)
    if (!search) return others
    const q = search.toLowerCase()
    return others.filter((u) => u.name.toLowerCase().includes(q))
  }, [users, currentUser, search])

  function handleUserClick(user) {
    // Find existing conversation or create one
    const existing = conversations.find(
      (c) => c.type === 'user' && c.participantId === user.uid
    )
    if (existing) {
      setActive(existing.id)
    } else {
      const newConv = {
        id: `conv_${currentUser.uid}_${user.uid}`,
        type: 'user',
        participantId: user.uid,
        lastMessage: null,
        unreadCount: 0,
        pinned: false,
        updatedAt: new Date(),
      }
      addConversation(newConv)
      setActive(newConv.id)
    }
  }

  return (
    <div>
      <div className="p-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search users..." />
      </div>
      {filtered.map((user) => (
        <div
          key={user.uid}
          onClick={() => handleUserClick(user)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="relative">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <PresenceBadge status={user.status} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.status}</p>
          </div>
          {user.blocked && (
            <span className="text-xs text-red-500 font-medium">Blocked</span>
          )}
        </div>
      ))}
    </div>
  )
}
