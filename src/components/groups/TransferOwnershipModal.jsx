import { useState } from 'react'
import Modal from '../shared/Modal'
import { useGroupStore } from '../../store/groupStore'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import { useToast } from '../shared/Toast'
import Avatar from '../shared/Avatar'

export default function TransferOwnershipModal({ open, onClose, group }) {
  const transferOwnership = useGroupStore((s) => s.transferOwnership)
  const users = useUserStore((s) => s.users)
  const currentUser = useAuthStore((s) => s.currentUser)
  const toast = useToast()
  const [selected, setSelected] = useState(null)

  if (!group) return null

  const eligibleMembers = group.members.filter((m) => m.uid !== currentUser?.uid)

  function handleTransfer() {
    if (!selected) return
    transferOwnership(group.guid, selected)
    const user = users.find((u) => u.uid === selected)
    toast(`Ownership transferred to ${user?.name}`, 'success')
    setSelected(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Transfer Ownership">
      <p className="text-sm text-gray-600 mb-4">Select a member to transfer group ownership to:</p>
      <div className="max-h-64 overflow-y-auto space-y-1">
        {eligibleMembers.map((member) => {
          const user = users.find((u) => u.uid === member.uid)
          if (!user) return null
          return (
            <button
              key={member.uid}
              onClick={() => setSelected(member.uid)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                selected === member.uid ? 'bg-primary-50 border border-primary-300' : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <Avatar src={user.avatar} name={user.name} size="sm" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{member.scope}</p>
              </div>
            </button>
          )
        })}
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button
          onClick={handleTransfer}
          disabled={!selected}
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-40"
        >
          Transfer
        </button>
      </div>
    </Modal>
  )
}
