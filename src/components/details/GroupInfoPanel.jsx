import { useState } from 'react'
import { useGroupStore } from '../../store/groupStore'
import { useAuthStore } from '../../store/authStore'
import { useConversationStore } from '../../store/conversationStore'
import { useToast } from '../shared/Toast'
import Avatar from '../shared/Avatar'
import GroupMembersPanel from './GroupMembersPanel'
import SharedMediaPanel from './SharedMediaPanel'
import UpdateGroupModal from '../groups/UpdateGroupModal'
import AddMembersModal from '../groups/AddMembersModal'
import TransferOwnershipModal from '../groups/TransferOwnershipModal'

const typeLabels = { public: 'Public', private: 'Private', password: 'Password Protected' }

export default function GroupInfoPanel({ groupId }) {
  const getGroup = useGroupStore((s) => s.getGroup)
  const leaveGroup = useGroupStore((s) => s.leaveGroup)
  const deleteGroup = useGroupStore((s) => s.deleteGroup)
  const currentUser = useAuthStore((s) => s.currentUser)
  const deleteConversation = useConversationStore((s) => s.deleteConversation)
  const activeConversationId = useConversationStore((s) => s.activeConversationId)
  const toast = useToast()

  const [showUpdate, setShowUpdate] = useState(false)
  const [showAddMembers, setShowAddMembers] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)

  const group = getGroup(groupId)
  if (!group) return null

  const myMembership = group.members.find((m) => m.uid === currentUser?.uid)
  const isOwner = myMembership?.scope === 'owner'
  const isAdmin = myMembership?.scope === 'admin' || isOwner

  function handleLeave() {
    leaveGroup(groupId, currentUser.uid)
    deleteConversation(activeConversationId)
    toast(`Left ${group.name}`, 'info')
  }

  function handleDelete() {
    deleteGroup(groupId)
    deleteConversation(activeConversationId)
    toast(`${group.name} deleted`, 'info')
  }

  return (
    <div className="flex flex-col">
      {/* Group header */}
      <div className="flex flex-col items-center py-6 border-b border-gray-100">
        <Avatar src={group.icon} name={group.name} size="xl" className="mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
        <p className="text-sm text-gray-500">{typeLabels[group.type]}</p>
      </div>

      {/* Description */}
      {group.description && (
        <div className="px-4 py-4 border-b border-gray-100">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
          <p className="text-sm text-gray-700">{group.description}</p>
        </div>
      )}

      {/* Details */}
      <div className="px-4 py-4 border-b border-gray-100 space-y-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Members</span>
          <span className="text-sm text-gray-900">{group.membersCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Created</span>
          <span className="text-sm text-gray-900">
            {group.createdAt?.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Type</span>
          <span className="text-sm text-gray-900">{typeLabels[group.type]}</span>
        </div>
      </div>

      {/* Members */}
      <GroupMembersPanel group={group} isAdmin={isAdmin} />

      {/* Shared Media */}
      <SharedMediaPanel conversationId={activeConversationId} />

      {/* Actions */}
      <div className="px-4 py-4 space-y-2">
        {isAdmin && (
          <>
            <button
              onClick={() => setShowAddMembers(true)}
              className="w-full py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              Add Members
            </button>
            <button
              onClick={() => setShowUpdate(true)}
              className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Edit Group
            </button>
          </>
        )}
        {isOwner && (
          <>
            <button
              onClick={() => setShowTransfer(true)}
              className="w-full py-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100"
            >
              Transfer Ownership
            </button>
            <button
              onClick={handleDelete}
              className="w-full py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
            >
              Delete Group
            </button>
          </>
        )}
        {myMembership && !isOwner && (
          <button
            onClick={handleLeave}
            className="w-full py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
          >
            Leave Group
          </button>
        )}
      </div>

      <UpdateGroupModal open={showUpdate} onClose={() => setShowUpdate(false)} group={group} />
      <AddMembersModal open={showAddMembers} onClose={() => setShowAddMembers(false)} group={group} />
      <TransferOwnershipModal open={showTransfer} onClose={() => setShowTransfer(false)} group={group} />
    </div>
  )
}
