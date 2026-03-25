import { create } from 'zustand'
import { MESSAGES } from '../data/messages'
import { generateId } from '../data/helpers'

export const useMessageStore = create((set, get) => ({
  messages: JSON.parse(JSON.stringify(MESSAGES, (key, value) => {
    if (value instanceof Date) return value.toISOString()
    return value
  })),

  // Restore dates from ISO strings
  getMessages: (conversationId) => {
    const msgs = get().messages[conversationId] || []
    return msgs.map((m) => ({
      ...m,
      sentAt: new Date(m.sentAt),
      editedAt: m.editedAt ? new Date(m.editedAt) : null,
      deletedAt: m.deletedAt ? new Date(m.deletedAt) : null,
      readAt: m.readAt ? new Date(m.readAt) : null,
      deliveredAt: m.deliveredAt ? new Date(m.deliveredAt) : null,
    }))
  },

  getThreadMessages: (conversationId, parentId) => {
    const msgs = get().getMessages(conversationId)
    return msgs.filter((m) => m.parentId === parentId)
  },

  sendMessage: (conversationId, message) => {
    const newMsg = {
      id: generateId(),
      conversationId,
      sentAt: new Date().toISOString(),
      editedAt: null,
      deletedAt: null,
      deletedBy: null,
      readAt: null,
      deliveredAt: new Date().toISOString(),
      reactions: {},
      parentId: null,
      replyCount: 0,
      mentions: [],
      ...message,
    }
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMsg],
      },
    }))
    // If it's a thread reply, increment parent replyCount
    if (message.parentId) {
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: state.messages[conversationId].map((m) =>
            m.id === message.parentId ? { ...m, replyCount: (m.replyCount || 0) + 1 } : m
          ),
        },
      }))
    }
    return newMsg
  },

  editMessage: (conversationId, messageId, newText) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: state.messages[conversationId].map((m) =>
          m.id === messageId ? { ...m, text: newText, editedAt: new Date().toISOString() } : m
        ),
      },
    }))
  },

  deleteMessage: (conversationId, messageId, deleteFor) => {
    if (deleteFor === 'everyone') {
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: state.messages[conversationId].map((m) =>
            m.id === messageId
              ? { ...m, deletedAt: new Date().toISOString(), deletedBy: 'everyone', text: '' }
              : m
          ),
        },
      }))
    } else {
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: state.messages[conversationId].filter((m) => m.id !== messageId),
        },
      }))
    }
  },

  toggleReaction: (conversationId, messageId, emoji, userId) => {
    set((state) => {
      const msgs = state.messages[conversationId] || []
      return {
        messages: {
          ...state.messages,
          [conversationId]: msgs.map((m) => {
            if (m.id !== messageId) return m
            const reactions = { ...m.reactions }
            if (!reactions[emoji]) {
              reactions[emoji] = [userId]
            } else if (reactions[emoji].includes(userId)) {
              reactions[emoji] = reactions[emoji].filter((u) => u !== userId)
              if (reactions[emoji].length === 0) delete reactions[emoji]
            } else {
              reactions[emoji] = [...reactions[emoji], userId]
            }
            return { ...m, reactions }
          }),
        },
      }
    })
  },

  voteOnPoll: (conversationId, messageId, optionId, userId) => {
    set((state) => {
      const msgs = state.messages[conversationId] || []
      return {
        messages: {
          ...state.messages,
          [conversationId]: msgs.map((m) => {
            if (m.id !== messageId) return m
            const options = m.options.map((opt) => {
              const voters = opt.voters.filter((v) => v !== userId)
              if (opt.id === optionId) voters.push(userId)
              return { ...opt, voters }
            })
            return { ...m, options }
          }),
        },
      }
    })
  },
}))
