import { create } from 'zustand'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink'

interface User {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  accountType: 'email' | 'google'
  memberSince: string
}

interface Database {
  id: string
  name: string
  examsCount: number
  createdAt: string
  recentExams: {
    id: string
    title: string
    status: 'draft' | 'published'
  }[]
}

interface AppState {
  user: User | null
  databases: Database[]
  theme: ThemeMode
  themeColor: ThemeColor
  brightness: number
  notifications: number
  
  setUser: (user: User | null) => void
  setDatabases: (databases: Database[]) => void
  setTheme: (theme: ThemeMode) => void
  setThemeColor: (color: ThemeColor) => void
  setBrightness: (brightness: number) => void
  setNotifications: (count: number) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  databases: [],
  theme: 'system',
  themeColor: 'blue',
  brightness: 100,
  notifications: 0,
  
  setUser: (user) => set({ user }),
  setDatabases: (databases) => set({ databases }),
  setTheme: (theme) => set({ theme }),
  setThemeColor: (color) => set({ themeColor: color }),
  setBrightness: (brightness) => set({ brightness }),
  setNotifications: (count) => set({ notifications: count }),
}))
