import { create } from 'zustand'
import type { Task, DailyRecord, Reward, RedeemRecord, AppState, ThemeId } from '../types'
import * as db from '../db'
import { DEFAULT_TASKS, DEFAULT_REWARDS, getLevelFromPoints, THEMES } from '../data'

interface Store {
  // 状态
  appState: AppState
  tasks: Task[]
  todayRecord: DailyRecord | null
  rewards: Reward[]
  redeemRecords: RedeemRecord[]
  isLoading: boolean
  showMotivation: boolean
  motivationText: string

  // 初始化
  init: () => Promise<void>

  // 任务操作
  completeTask: (taskId: string) => Promise<void>
  uncompleteTask: (taskId: string) => Promise<void>
  addTask: (task: Task) => Promise<void>
  removeTask: (taskId: string) => Promise<void>

  // 奖励操作
  addReward: (reward: Reward) => Promise<void>
  removeReward: (rewardId: string) => Promise<void>
  redeemReward: (reward: Reward) => Promise<boolean>

  // 主题操作
  setTheme: (themeId: ThemeId) => Promise<void>
  unlockTheme: (themeId: ThemeId) => Promise<boolean>

  // 重置操作
  resetPoints: () => Promise<void>
  resetAll: () => Promise<void>

  // 激励弹窗
  hideMotivation: () => void
}

const today = () => new Date().toISOString().split('T')[0]

export const useStore = create<Store>((set, get) => ({
  appState: { totalPoints: 0, streak: 0, level: 1, lastActiveDate: '', unlockedThemes: ['piggy'], currentTheme: 'piggy' },
  tasks: [],
  todayRecord: null,
  rewards: [],
  redeemRecords: [],
  isLoading: true,
  showMotivation: false,
  motivationText: '',

  init: async () => {
    const [appState, tasks, rewards, redeemRecords] = await Promise.all([
      db.getAppState(),
      db.getTasks(),
      db.getRewards(),
      db.getAllRedeemRecords(),
    ])

    // 初始化默认任务
    let finalTasks = tasks
    if (tasks.length === 0) {
      for (const task of DEFAULT_TASKS) await db.saveTask(task)
      finalTasks = DEFAULT_TASKS
    }

    // 初始化默认奖励
    let finalRewards = rewards
    if (rewards.length === 0) {
      for (const reward of DEFAULT_REWARDS) await db.saveReward(reward)
      finalRewards = DEFAULT_REWARDS
    }

    // 计算连续打卡
    const todayStr = today()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    let streak = appState.streak
    if (appState.lastActiveDate !== todayStr && appState.lastActiveDate !== yesterdayStr) {
      streak = 0
    }

    const todayRecord = await db.getDailyRecord(todayStr)
    const updatedState = { ...appState, streak, level: getLevelFromPoints(appState.totalPoints) }
    await db.saveAppState(updatedState)

    set({ appState: updatedState, tasks: finalTasks, rewards: finalRewards, redeemRecords, todayRecord: todayRecord ?? null, isLoading: false })
  },

  completeTask: async (taskId) => {
    const { tasks, todayRecord, appState } = get()
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const todayStr = today()
    const record: DailyRecord = todayRecord ?? { date: todayStr, completedTasks: [], pointsEarned: 0, bonusPoints: 0 }
    if (record.completedTasks.includes(taskId)) return

    const newCompleted = [...record.completedTasks, taskId]
    const streakBonus = appState.streak >= 7 ? 3 : appState.streak >= 3 ? 2 : 0
    const bonus = Math.floor(task.points * streakBonus / 10)
    const newRecord: DailyRecord = {
      ...record,
      completedTasks: newCompleted,
      pointsEarned: record.pointsEarned + task.points,
      bonusPoints: record.bonusPoints + bonus,
    }

    const newTotal = appState.totalPoints + task.points + bonus
    const newStreak = appState.lastActiveDate !== todayStr ? appState.streak + 1 : appState.streak
    const newState: AppState = {
      ...appState,
      totalPoints: newTotal,
      streak: newStreak,
      level: getLevelFromPoints(newTotal),
      lastActiveDate: todayStr,
    }

    await Promise.all([db.saveDailyRecord(newRecord), db.saveAppState(newState)])

    // 随机激励语
    const { MOTIVATIONS } = await import('../data')
    const text = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]

    set({ todayRecord: newRecord, appState: newState, showMotivation: true, motivationText: text })
  },

  uncompleteTask: async (taskId) => {
    const { tasks, todayRecord, appState } = get()
    const task = tasks.find(t => t.id === taskId)
    if (!task || !todayRecord) return

    const newCompleted = todayRecord.completedTasks.filter(id => id !== taskId)
    const newRecord: DailyRecord = {
      ...todayRecord,
      completedTasks: newCompleted,
      pointsEarned: todayRecord.pointsEarned - task.points,
    }
    const newState: AppState = { ...appState, totalPoints: Math.max(0, appState.totalPoints - task.points) }

    await Promise.all([db.saveDailyRecord(newRecord), db.saveAppState(newState)])
    set({ todayRecord: newRecord, appState: newState })
  },

  addTask: async (task) => {
    await db.saveTask(task)
    set(s => ({ tasks: [...s.tasks, task] }))
  },

  removeTask: async (taskId) => {
    await db.deleteTask(taskId)
    set(s => ({ tasks: s.tasks.filter(t => t.id !== taskId) }))
  },

  addReward: async (reward) => {
    await db.saveReward(reward)
    set(s => ({ rewards: [...s.rewards, reward] }))
  },

  removeReward: async (rewardId) => {
    await db.deleteReward(rewardId)
    set(s => ({ rewards: s.rewards.filter(r => r.id !== rewardId) }))
  },

  redeemReward: async (reward) => {
    const { appState } = get()
    if (appState.totalPoints < reward.cost) return false

    const record: RedeemRecord = {
      id: `redeem-${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      cost: reward.cost,
      date: today(),
    }
    const newState = { ...appState, totalPoints: appState.totalPoints - reward.cost }
    await Promise.all([db.addRedeemRecord(record), db.saveAppState(newState)])
    set(s => ({ appState: newState, redeemRecords: [...s.redeemRecords, record] }))
    return true
  },

  setTheme: async (themeId) => {
    const { appState } = get()
    if (!appState.unlockedThemes.includes(themeId)) return
    const newState = { ...appState, currentTheme: themeId }
    await db.saveAppState(newState)
    set({ appState: newState })
  },

  unlockTheme: async (themeId) => {
    const { appState } = get()
    const theme = THEMES.find(t => t.id === themeId)
    if (!theme || appState.totalPoints < theme.unlockCost) return false
    if (appState.unlockedThemes.includes(themeId)) return true
    const newState = {
      ...appState,
      totalPoints: appState.totalPoints - theme.unlockCost,
      unlockedThemes: [...appState.unlockedThemes, themeId],
    }
    await db.saveAppState(newState)
    set({ appState: newState })
    return true
  },

  resetPoints: async () => {
    const { appState } = get()
    const newState = { ...appState, totalPoints: 0 }
    await db.saveAppState(newState)
    set({ appState: newState })
  },

  resetAll: async () => {
    await db.resetAllData()
    const newState: AppState = { totalPoints: 0, streak: 0, level: 1, lastActiveDate: '', unlockedThemes: ['piggy'], currentTheme: 'piggy' }
    set({ appState: newState, todayRecord: null, redeemRecords: [] })
  },

  hideMotivation: () => set({ showMotivation: false }),
}))
