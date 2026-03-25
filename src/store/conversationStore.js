import { create } from 'zustand'
import { CONVERSATIONS } from '../data/conversations'

export const useConversationStore = create((set, get) => ({
  conversations: [...CONVERSATIONS],
  activeConversationId: null,

  setActive: (id) => {
    set({ activeConversationId: id })
    // Mark as read
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, unreadCount: 0 } : c
      ),
    }))
  },

  getActive: () => {
    const { conversations, activeConversationId } = get()
    return conversations.find((c) => c.id === activeConversationId) || null
  },

  updateLastMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: {
                text: message.text || '',
                sender: message.sender,
                sentAt: message.sentAt,
                type: message.type,
              },
              updatedAt: message.sentAt,
            }
          : c
      ),
    }))
  },

  pinConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      ),
    }))
  },

  deleteConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
    }))
  },

  addConversation: (conversation) => {
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    }))
  },

  incrementUnread: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: c.unreadCount + 1 } : c
      ),
    }))
  },
}))
