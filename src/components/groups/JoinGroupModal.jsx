import { useState } from 'react'
import Modal from '../shared/Modal'
import { useGroupStore } from '../../store/groupStore'
import { useAuthStore } from '../../store/authStore'
import { useConversationStore } from '../../store/conversationStore'
import { useToast } from '../shared/Toast'

export default function JoinGroupModal({ open, onClose, group }) {
  const joinGroup = useGroupStore((s) => s.joinGroup)
  const currentUser = useAuthStore((s) => s.currentUser)
  const addConversation = useConversationStore((s) => s.addConversation)
  const setActive = useConversationStore((s) => s.setActive)
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!group) return null

  function handleJoin() {
    if (group.type === 'password' && password !== group.password) {
      setError('Incorrect password')
      return
    }
    if (group.type === 'private') {
      toast('This group is private. Request sent.', 'info')
      onClose()
      return
    }
    joinGroup(group.guid, currentUser.uid)
    const conv = {
      id: `conv_group_${group.guid}`,
      type: 'group',
      participantId: group.guid,
      lastMessage: null,
      unreadCount: 0,
      pinned: false,
      updatedAt: new Date(),
    }
    addConversation(conv)
    setActive(conv.id)
    toast(`Joined ${group.name}!`, 'success')
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={`Join ${group.name}`}>
      <p className="text-sm text-gray-600 mb-4">
        {group.type === 'public' && 'This is a public group. Click join to enter.'}
        {group.type === 'private' && 'This is a private group. Your request will need to be approved.'}
        {group.type === 'password' && 'This group requires a password to join.'}
      </p>
      {group.type === 'password' && (
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="Enter group password"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button
          onClick={handleJoin}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          {group.type === 'private' ? 'Request to Join' : 'Join'}
        </button>
      </div>
    </Modal>
  )
}
