import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
}))
