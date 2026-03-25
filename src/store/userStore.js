import { create } from 'zustand'
import { USERS } from '../data/users'

export const useUserStore = create((set, get) => ({
  users: [...USERS],

  getUser: (uid) => get().users.find((u) => u.uid === uid),

  toggleBlock: (uid) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.uid === uid ? { ...u, blocked: !u.blocked } : u
      ),
    }))
  },

  setStatus: (uid, status) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.uid === uid ? { ...u, status, lastActiveAt: status === 'online' ? new Date() : u.lastActiveAt } : u
      ),
    }))
  },

  searchUsers: (query) => {
    const q = query.toLowerCase()
    return get().users.filter((u) => u.name.toLowerCase().includes(q))
  },
}))
