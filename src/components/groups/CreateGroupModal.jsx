import { useState } from 'react'
import Modal from '../shared/Modal'
import { useGroupStore } from '../../store/groupStore'
import { useAuthStore } from '../../store/authStore'
import { useConversationStore } from '../../store/conversationStore'
import { useToast } from '../shared/Toast'

export default function CreateGroupModal({ open, onClose }) {
  const createGroup = useGroupStore((s) => s.createGroup)
  const currentUser = useAuthStore((s) => s.currentUser)
  const addConversation = useConversationStore((s) => s.addConversation)
  const setActive = useConversationStore((s) => s.setActive)
  const toast = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('public')
  const [password, setPassword] = useState('')

  function handleCreate() {
    if (!name.trim()) return
    const group = createGroup({
      name: name.trim(),
      description: description.trim(),
      type,
      password: type === 'password' ? password : '',
      owner: currentUser.uid,
    })
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
    toast(`${group.name} created!`, 'success')
    setName('')
    setDescription('')
    setType('public')
    setPassword('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Group">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter group name"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div className="flex gap-2">
            {['public', 'private', 'password'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                  type === t
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {type === 'password' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter group password"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-40"
        >
          Create
        </button>
      </div>
    </Modal>
  )
}
