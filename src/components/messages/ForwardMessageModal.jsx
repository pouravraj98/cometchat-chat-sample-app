import { useState } from 'react'
import Modal from '../shared/Modal'
import { useConversationStore } from '../../store/conversationStore'
import { useUserStore } from '../../store/userStore'
import { useGroupStore } from '../../store/groupStore'
import { useAuthStore } from '../../store/authStore'
import { useMessageStore } from '../../store/messageStore'
import { useToast } from '../shared/Toast'
import Avatar from '../shared/Avatar'
import SearchInput from '../shared/SearchInput'

export default function ForwardMessageModal({ open, onClose, message }) {
  const conversations = useConversationStore((s) => s.conversations)
  const updateLastMessage = useConversationStore((s) => s.updateLastMessage)
  const users = useUserStore((s) => s.users)
  const groups = useGroupStore((s) => s.groups)
  const currentUser = useAuthStore((s) => s.currentUser)
  const sendMessage = useMessageStore((s) => s.sendMessage)
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])

  const filtered = conversations.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    if (c.type === 'user') {
      const u = users.find((u) => u.uid === c.participantId)
      return u?.name.toLowerCase().includes(q)
    }
    const g = groups.find((g) => g.guid === c.participantId)
    return g?.name.toLowerCase().includes(q)
  })

  function getName(conv) {
    if (conv.type === 'user') return users.find((u) => u.uid === conv.participantId)?.name || ''
    return groups.find((g) => g.guid === conv.participantId)?.name || ''
  }

  function getAvatar(conv) {
    if (conv.type === 'user') return users.find((u) => u.uid === conv.participantId)?.avatar
    return groups.find((g) => g.guid === conv.participantId)?.icon
  }

  function toggleSelect(id) {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  function handleForward() {
    selected.forEach((convId) => {
      const msg = {
        sender: currentUser.uid,
        type: message.type,
        text: message.text || '',
        ...(message.url && { url: message.url, fileName: message.fileName }),
      }
      const sent = sendMessage(convId, msg)
      updateLastMessage(convId, { ...sent, sentAt: new Date(sent.sentAt) })
    })
    toast(`Message forwarded to ${selected.length} conversation(s)`, 'success')
    setSelected([])
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Forward Message">
      <SearchInput value={search} onChange={setSearch} placeholder="Search conversations..." />
      <div className="mt-3 max-h-64 overflow-y-auto space-y-1">
        {filtered.map((conv) => (
          <label
            key={conv.id}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(conv.id)}
              onChange={() => toggleSelect(conv.id)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <Avatar src={getAvatar(conv)} name={getName(conv)} size="sm" />
            <span className="text-sm text-gray-900">{getName(conv)}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button
          onClick={handleForward}
          disabled={selected.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-40"
        >
          Forward ({selected.length})
        </button>
      </div>
    </Modal>
  )
}
