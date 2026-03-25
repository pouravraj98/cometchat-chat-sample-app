import { create } from 'zustand'
import { GROUPS } from '../data/groups'
import { generateId } from '../data/helpers'

export const useGroupStore = create((set, get) => ({
  groups: [...GROUPS],

  getGroup: (guid) => get().groups.find((g) => g.guid === guid),

  createGroup: ({ name, description, type, password, owner }) => {
    const newGroup = {
      guid: `group_${generateId()}`,
      name,
      icon: `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(name)}`,
      description: description || '',
      type,
      password: password || '',
      owner,
      membersCount: 1,
      members: [{ uid: owner, scope: 'owner', joinedAt: new Date() }],
      bannedMembers: [],
      createdAt: new Date(),
      tags: [],
    }
    set((state) => ({ groups: [...state.groups, newGroup] }))
    return newGroup
  },

  updateGroup: (guid, updates) => {
    set((state) => ({
      groups: state.groups.map((g) => (g.guid === guid ? { ...g, ...updates } : g)),
    }))
  },

  deleteGroup: (guid) => {
    set((state) => ({
      groups: state.groups.filter((g) => g.guid !== guid),
    }))
  },

  joinGroup: (guid, uid) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.guid !== guid) return g
        if (g.members.find((m) => m.uid === uid)) return g
        return {
          ...g,
          membersCount: g.membersCount + 1,
          members: [...g.members, { uid, scope: 'participant', joinedAt: new Date() }],
        }
      }),
    }))
  },

  leaveGroup: (guid, uid) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.guid !== guid) return g
        return {
          ...g,
          membersCount: g.membersCount - 1,
          members: g.members.filter((m) => m.uid !== uid),
        }
      }),
    }))
  },

  addMember: (guid, uid) => {
    get().joinGroup(guid, uid)
  },

  removeMember: (guid, uid) => {
    get().leaveGroup(guid, uid)
  },

  banMember: (guid, uid) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.guid !== guid) return g
        return {
          ...g,
          membersCount: g.membersCount - 1,
          members: g.members.filter((m) => m.uid !== uid),
          bannedMembers: [...g.bannedMembers, uid],
        }
      }),
    }))
  },

  unbanMember: (guid, uid) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.guid !== guid) return g
        return { ...g, bannedMembers: g.bannedMembers.filter((b) => b !== uid) }
      }),
    }))
  },

  changeMemberScope: (guid, uid, newScope) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.guid !== guid) return g
        return {
          ...g,
          members: g.members.map((m) => (m.uid === uid ? { ...m, scope: newScope } : m)),
        }
      }),
    }))
  },

  transferOwnership: (guid, newOwnerUid) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.guid !== guid) return g
        return {
          ...g,
          owner: newOwnerUid,
          members: g.members.map((m) => {
            if (m.uid === newOwnerUid) return { ...m, scope: 'owner' }
            if (m.scope === 'owner') return { ...m, scope: 'admin' }
            return m
          }),
        }
      }),
    }))
  },

  searchGroups: (query) => {
    const q = query.toLowerCase()
    return get().groups.filter((g) => g.name.toLowerCase().includes(q))
  },
}))
