import { useState } from 'react'
import Modal from '../shared/Modal'
import { useGroupStore } from '../../store/groupStore'
import { useToast } from '../shared/Toast'

export default function UpdateGroupModal({ open, onClose, group }) {
  const updateGroup = useGroupStore((s) => s.updateGroup)
  const toast = useToast()
  const [name, setName] = useState(group?.name || '')
  const [description, setDescription] = useState(group?.description || '')

  if (!group) return null

  function handleSave() {
    if (!name.trim()) return
    updateGroup(group.guid, { name: name.trim(), description: description.trim() })
    toast('Group updated', 'success')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Group">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </Modal>
  )
}
