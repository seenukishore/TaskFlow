import { create } from 'zustand'

const useAppStore = create((set) => ({
  currentOrg: null,
  currentProject: null,
  sidebarOpen: true,

  setCurrentOrg: (org) => set({ currentOrg: org }),
  setCurrentProject: (project) => set({ currentProject: project }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications]
    })),
  clearNotifications: () => set({ notifications: [] })
}))

export default useAppStore