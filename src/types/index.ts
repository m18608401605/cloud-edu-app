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
  deadline?: string     // 截止时间 HH:MM
  completedAt?: string  // 完成时间 HH:MM
}

// 每日任务安排：当天选择的任务ID列表（来自任务模板库）
export interface DailyPlan {
  date: string      // YYYY-MM-DD
  taskIds: string[] // 当天计划做的任务
}

export interface DailyRecord {
  date: string // YYYY-MM-DD
  completedTasks: string[] // task ids
  completedAt: Record<string, string> // taskId -> HH:MM 完成时间
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

export interface UiSettings {
  sidebarWidth: number     // 200~400, default 288
  starBrightness: number   // 0~100, default 60
  fontSize: number         // 12~20, default 14
  contentMaxWidth: number  // 480~960, default 672
  cardRadius: number       // 4~24, default 12
  bgOpacity: number        // 0~100, default 60
  brightness: number       // 50~150, default 100 (整体亮度)
  textBrightness: number   // 50~150, default 100 (文字对比度)
}

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
  customBg?: string
  customAvatar?: string
  colorMode?: 'dark' | 'light'
  uiSettings?: UiSettings
  taskOrder?: string[]  // 任务排序顺序（task id 数组）
}
