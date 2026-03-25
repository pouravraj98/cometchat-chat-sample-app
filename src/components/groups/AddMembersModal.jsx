import { useState, useMemo } from 'react'
import Modal from '../shared/Modal'
import { useUserStore } from '../../store/userStore'
import { useGroupStore } from '../../store/groupStore'
import { useToast } from '../shared/Toast'
import Avatar from '../shared/Avatar'
import SearchInput from '../shared/SearchInput'

export default function AddMembersModal({ open, onClose, group }) {
  const users = useUserStore((s) => s.users)
  const addMember = useGroupStore((s) => s.addMember)
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])

  const nonMembers = useMemo(() => {
    if (!group) return []
    const memberUids = group.members.map((m) => m.uid)
    const banned = group.bannedMembers || []
    return users.filter((u) => !memberUids.includes(u.uid) && !banned.includes(u.uid))
  }, [users, group])

  const filtered = useMemo(() => {
    if (!search) return nonMembers
    const q = search.toLowerCase()
    return nonMembers.filter((u) => u.name.toLowerCase().includes(q))
  }, [nonMembers, search])

  function toggleSelect(uid) {
    setSelected((prev) => prev.includes(uid) ? prev.filter((s) => s !== uid) : [...prev, uid])
  }

  function handleAdd() {
    selected.forEach((uid) => addMember(group.guid, uid))
    toast(`${selected.length} member(s) added`, 'success')
    setSelected([])
    setSearch('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Members">
      <SearchInput value={search} onChange={setSearch} placeholder="Search users..." />
      <div className="mt-3 max-h-64 overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No users available to add</p>
        ) : (
          filtered.map((user) => (
            <label
              key={user.uid}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(user.uid)}
                onChange={() => toggleSelect(user.uid)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <Avatar src={user.avatar} name={user.name} size="sm" />
              <span className="text-sm text-gray-900">{user.name}</span>
            </label>
          ))
        )}
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button
          onClick={handleAdd}
          disabled={selected.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-40"
        >
          Add ({selected.length})
        </button>
      </div>
    </Modal>
  )
}
