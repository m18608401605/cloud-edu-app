// 类型定义

export type TaskCategory = 'study' | 'sport' | 'fun' | 'extra' | 'custom'

export interface Task {
  id: string
  title: string
  icon: string
  points: number
  category: TaskCategory
  description?: string
  isCustom?: boolean
}

export interface DailyRecord {
  date: string // YYYY-MM-DD
  completedTasks: string[] // task ids
  pointsEarned: number
  bonusPoints: number // 连续打卡奖励
}

export interface Reward {
  id: string
  title: string
  icon: string
  cost: number
  description?: string
  isCustom?: boolean
  redeemed?: boolean
}

export interface RedeemRecord {
  id: string
  rewardId: string
  rewardTitle: string
  cost: number
  date: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  condition: string
}

export type ThemeId = 'piggy' | 'ocean' | 'forest' | 'galaxy' | 'candy'

export interface Theme {
  id: ThemeId
  name: string
  emoji: string
  bg: string
  cardBg: string
  primary: string
  secondary: string
  accent: string
  unlockCost: number
}

export interface AppState {
  totalPoints: number
  streak: number
  level: number
  lastActiveDate: string
  unlockedThemes: ThemeId[]
  currentTheme: ThemeId
}
