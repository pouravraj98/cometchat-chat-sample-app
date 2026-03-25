import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../shared/Avatar'
import PresenceBadge from '../shared/PresenceBadge'
import Tabs from '../shared/Tabs'
import ConversationList from '../sidebar/ConversationList'
import UserList from '../sidebar/UserList'
import GroupList from '../sidebar/GroupList'

const SIDEBAR_TABS = [
  { id: 'chats', label: 'Chats' },
  { id: 'users', label: 'Users' },
  { id: 'groups', label: 'Groups' },
]

export default function LeftSidebar() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('chats')

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-white shrink-0">
      {/* User header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <div className="relative">
          <Avatar src={currentUser?.avatar} name={currentUser?.name} size="md" />
          <PresenceBadge status="online" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{currentUser?.name}</p>
          <p className="text-xs text-green-600">Online</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <Tabs tabs={SIDEBAR_TABS} active={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'chats' && <ConversationList />}
        {activeTab === 'users' && <UserList />}
        {activeTab === 'groups' && <GroupList />}
      </div>
    </div>
  )
}
