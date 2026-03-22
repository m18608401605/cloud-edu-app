export type TaskCategory = 'study' | 'sport' | 'fun' | 'extra' | 'custom'
export type SubjectId = 'chinese' | 'math' | 'english' | 'science' | 'arts' | 'sport' | 'habit'
export type CapabilityId = 'focus' | 'reading' | 'writing' | 'logic' | 'speaking' | 'creativity' | 'fitness' | 'discipline'
export type ThemeId = 'piggy' | 'ocean' | 'forest' | 'galaxy' | 'candy'
export type VoiceMode = 'reading' | 'retell' | 'speaking'

export interface Task {
  id: string
  title: string
  icon: string
  points: number
  category: TaskCategory
  description?: string
  isCustom?: boolean
  deadline?: string
  completedAt?: string
  subjectId?: SubjectId
  capabilityIds?: CapabilityId[]
}

export interface DailyPlan {
  date: string
  taskIds: string[]
}

export interface DailyRecord {
  date: string
  completedTasks: string[]
  completedAt: Record<string, string>
  pointsEarned: number
  bonusPoints: number
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

export interface UiSettings {
  sidebarWidth: number
  starBrightness: number
  fontSize: number
  contentMaxWidth: number
  cardRadius: number
  bgOpacity: number
  brightness: number
  textBrightness: number
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
  taskOrder?: string[]
}

export interface BackupData {
  version: number
  exportedAt: string
  source: 'kids-points-system'
  data: {
    appState: AppState
    tasks: Task[]
    dailyPlans: DailyPlan[]
    dailyRecords: DailyRecord[]
    rewards: Reward[]
    redeemRecords: RedeemRecord[]
    users?: UserAccount[]
    childProfiles?: ChildProfile[]
    profileSnapshots?: ProfileSnapshot[]
    voiceSessions?: VoiceSession[]
    session?: AppSession | null
  }
}

export interface UserAccount {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

export interface ChildProfile {
  id: string
  userId: string
  name: string
  age: number
  grade: string
  avatarEmoji: string
  target: string
  focusSubjects: SubjectId[]
  focusCapabilities: CapabilityId[]
  createdAt: string
}

export interface AppSession {
  userId: string
  activeProfileId?: string
}

export interface ProfileSnapshot {
  profileId: string
  backup: BackupData
  updatedAt: string
}

export interface VoiceSession {
  id: string
  userId: string
  profileId: string
  title: string
  mode: VoiceMode
  subjectId: SubjectId
  capabilityId: CapabilityId
  transcript: string
  durationSec: number
  recordedAt: string
  score: number
  fluencyScore: number
  vocabularyScore: number
  confidenceScore: number
  keywords: string[]
  summary: string
}

export interface VoiceAnalysisInput {
  title: string
  mode: VoiceMode
  subjectId: SubjectId
  capabilityId: CapabilityId
  transcript: string
  durationSec: number
}
