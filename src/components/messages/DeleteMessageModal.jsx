import Modal from '../shared/Modal'
import { useMessageStore } from '../../store/messageStore'
import { useToast } from '../shared/Toast'

export default function DeleteMessageModal({ open, onClose, message, conversationId, isOwn }) {
  const deleteMessage = useMessageStore((s) => s.deleteMessage)
  const toast = useToast()

  function handleDelete(deleteFor) {
    deleteMessage(conversationId, message.id, deleteFor)
    toast(deleteFor === 'everyone' ? 'Message deleted for everyone' : 'Message deleted', 'success')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Delete Message">
      <p className="text-sm text-gray-600 mb-6">How would you like to delete this message?</p>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleDelete('me')}
          className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-left"
        >
          Delete for me
        </button>
        {isOwn && (
          <button
            onClick={() => handleDelete('everyone')}
            className="w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 text-left"
          >
            Delete for everyone
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 text-left"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}
