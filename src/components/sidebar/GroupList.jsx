import { useState, useMemo } from 'react'
import { useGroupStore } from '../../store/groupStore'
import { useAuthStore } from '../../store/authStore'
import { useConversationStore } from '../../store/conversationStore'
import SearchInput from '../shared/SearchInput'
import Avatar from '../shared/Avatar'
import CreateGroupModal from '../groups/CreateGroupModal'
import JoinGroupModal from '../groups/JoinGroupModal'

const typeIcons = { public: '🌐', private: '🔒', password: '🔑' }

export default function GroupList() {
  const groups = useGroupStore((s) => s.groups)
  const currentUser = useAuthStore((s) => s.currentUser)
  const conversations = useConversationStore((s) => s.conversations)
  const setActive = useConversationStore((s) => s.setActive)
  const addConversation = useConversationStore((s) => s.addConversation)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [joinGroup, setJoinGroup] = useState(null)

  const filtered = useMemo(() => {
    if (!search) return groups
    const q = search.toLowerCase()
    return groups.filter((g) => g.name.toLowerCase().includes(q))
  }, [groups, search])

  function handleGroupClick(group) {
    const isMember = group.members.some((m) => m.uid === currentUser?.uid)
    if (!isMember) {
      setJoinGroup(group)
      return
    }
    const existing = conversations.find(
      (c) => c.type === 'group' && c.participantId === group.guid
    )
    if (existing) {
      setActive(existing.id)
    } else {
      const newConv = {
        id: `conv_group_${group.guid}`,
        type: 'group',
        participantId: group.guid,
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
      <div className="p-3 flex gap-2">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search groups..." />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
        >
          + New
        </button>
      </div>
      {filtered.map((group) => {
        const isMember = group.members.some((m) => m.uid === currentUser?.uid)
        return (
          <div
            key={group.guid}
            onClick={() => handleGroupClick(group)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Avatar src={group.icon} name={group.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {typeIcons[group.type]} {group.name}
              </p>
              <p className="text-xs text-gray-500">{group.membersCount} members</p>
            </div>
            {!isMember && (
              <span className="text-xs text-primary-600 font-medium">Join</span>
            )}
          </div>
        )
      })}
      <CreateGroupModal open={showCreate} onClose={() => setShowCreate(false)} />
      {joinGroup && (
        <JoinGroupModal
          open={!!joinGroup}
          onClose={() => setJoinGroup(null)}
          group={joinGroup}
        />
      )}
    </div>
  )
}
