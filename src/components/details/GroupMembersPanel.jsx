import { useUserStore } from '../../store/userStore'
import { useGroupStore } from '../../store/groupStore'
import { useAuthStore } from '../../store/authStore'
import { useToast } from '../shared/Toast'
import Avatar from '../shared/Avatar'
import PresenceBadge from '../shared/PresenceBadge'
import Dropdown from '../shared/Dropdown'

const scopeLabels = { owner: 'Owner', admin: 'Admin', participant: 'Member' }
const scopeColors = {
  owner: 'text-yellow-700 bg-yellow-50',
  admin: 'text-blue-700 bg-blue-50',
  participant: 'text-gray-600 bg-gray-100',
}

export default function GroupMembersPanel({ group, isAdmin }) {
  const users = useUserStore((s) => s.users)
  const currentUser = useAuthStore((s) => s.currentUser)
  const changeMemberScope = useGroupStore((s) => s.changeMemberScope)
  const removeMember = useGroupStore((s) => s.removeMember)
  const banMember = useGroupStore((s) => s.banMember)
  const toast = useToast()

  function getMenuItems(member) {
    if (member.uid === currentUser?.uid) return []
    if (!isAdmin) return []
    if (member.scope === 'owner') return []

    const items = []
    if (member.scope === 'participant') {
      items.push({ label: 'Make Admin', onClick: () => { changeMemberScope(group.guid, member.uid, 'admin'); toast('Member promoted to admin', 'success') } })
    }
    if (member.scope === 'admin') {
      items.push({ label: 'Demote to Member', onClick: () => { changeMemberScope(group.guid, member.uid, 'participant'); toast('Admin demoted', 'info') } })
    }
    items.push({ divider: true })
    items.push({ label: 'Remove', danger: true, onClick: () => { removeMember(group.guid, member.uid); toast('Member removed', 'info') } })
    items.push({ label: 'Ban', danger: true, onClick: () => { banMember(group.guid, member.uid); toast('Member banned', 'info') } })
    return items
  }

  return (
    <div className="border-b border-gray-100">
      <div className="px-4 pt-4 pb-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Members ({group.membersCount})
        </h4>
      </div>
      <div className="max-h-64 overflow-y-auto scrollbar-thin">
        {group.members.map((member) => {
          const user = users.find((u) => u.uid === member.uid)
          if (!user) return null
          const menuItems = getMenuItems(member)

          return (
            <div key={member.uid} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
              <div className="relative">
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <PresenceBadge status={user.status} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                  {member.uid === currentUser?.uid && <span className="text-gray-400 ml-1">(You)</span>}
                </p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${scopeColors[member.scope]}`}>
                {scopeLabels[member.scope]}
              </span>
              {menuItems.length > 0 && (
                <Dropdown
                  trigger={
                    <button className="p-1 rounded hover:bg-gray-200 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                      </svg>
                    </button>
                  }
                  items={menuItems}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
