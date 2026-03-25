import { useState } from 'react'
import Modal from '../shared/Modal'
import { useMessageStore } from '../../store/messageStore'
import { useToast } from '../shared/Toast'

export default function EditMessageModal({ open, onClose, message, conversationId }) {
  const editMessage = useMessageStore((s) => s.editMessage)
  const toast = useToast()
  const [text, setText] = useState(message?.text || '')

  function handleSave() {
    if (!text.trim()) return
    editMessage(conversationId, message.id, text.trim())
    toast('Message edited', 'success')
    onClose()
  }

  // Reset text when modal opens
  if (open && text !== (message?.text || '')) {
    // Only reset if message changed
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Message">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        rows={3}
        autoFocus
      />
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!text.trim() || text.trim() === message?.text}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </Modal>
  )
}
