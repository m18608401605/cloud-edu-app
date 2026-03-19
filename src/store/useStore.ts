import { create } from 'zustand'
import type { Task, DailyRecord, DailyPlan, Reward, RedeemRecord, AppState, ThemeId, UiSettings } from '../types'
import * as db from '../db'
import { DEFAULT_TASKS, DEFAULT_REWARDS, getLevelFromPoints, THEMES } from '../data'

export const DEFAULT_UI_SETTINGS: UiSettings = {
  sidebarWidth: 288,
  starBrightness: 60,
  fontSize: 14,
  contentMaxWidth: 672,
  cardRadius: 12,
  bgOpacity: 60,
  brightness: 110,
  textBrightness: 120,
}

interface Store {
  appState: AppState
  tasks: Task[]           // 任务模板库（全部）
  todayPlan: DailyPlan | null  // 今日计划（选出的任务ids）
  todayRecord: DailyRecord | null
  rewards: Reward[]
  redeemRecords: RedeemRecord[]
  isLoading: boolean
  showMotivation: boolean
  motivationText: string

  init: () => Promise<void>

  // 任务模板操作
  addTask: (task: Task) => Promise<void>
  removeTask: (taskId: string) => Promise<void>
  updateTask: (task: Task) => Promise<void>

  // 今日计划操作
  addToTodayPlan: (taskId: string) => Promise<void>
  removeFromTodayPlan: (taskId: string) => Promise<void>

  // 完成/取消完成
  completeTask: (taskId: string) => Promise<void>
  uncompleteTask: (taskId: string) => Promise<void>

  // 奖励操作
  addReward: (reward: Reward) => Promise<void>
  removeReward: (rewardId: string) => Promise<void>
  updateReward: (reward: Reward) => Promise<void>
  redeemReward: (reward: Reward) => Promise<boolean>

  // 主题
  setTheme: (themeId: ThemeId) => Promise<void>
  unlockTheme: (themeId: ThemeId) => Promise<boolean>
  setCustomBg: (base64: string | undefined) => Promise<void>
  setCustomAvatar: (base64: string | undefined) => Promise<void>
  setColorMode: (mode: 'dark' | 'light') => Promise<void>
  updateUiSettings: (patch: Partial<UiSettings>) => Promise<void>
  reorderTasks: (fromIndex: number, toIndex: number) => Promise<void>

  // 重置
  resetPoints: () => Promise<void>
  resetAll: () => Promise<void>

  hideMotivation: () => void
}

const today = () => new Date().toISOString().split('T')[0]
const nowTime = () => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

export const useStore = create<Store>((set, get) => ({
  appState: { totalPoints: 0, streak: 0, level: 1, lastActiveDate: '', unlockedThemes: ['piggy'], currentTheme: 'piggy' },
  tasks: [],
  todayPlan: null,
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

    let finalTasks = tasks
    if (tasks.length === 0) {
      for (const task of DEFAULT_TASKS) await db.saveTask(task)
      finalTasks = DEFAULT_TASKS
    }

    let finalRewards = rewards
    if (rewards.length === 0) {
      for (const reward of DEFAULT_REWARDS) await db.saveReward(reward)
      finalRewards = DEFAULT_REWARDS
    }

    const todayStr = today()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    let streak = appState.streak
    if (appState.lastActiveDate !== todayStr && appState.lastActiveDate !== yesterdayStr) {
      streak = 0
    }

    const [todayRecord, todayPlan] = await Promise.all([
      db.getDailyRecord(todayStr),
      db.getDailyPlan(todayStr),
    ])

    // 如果今天没有计划，默认把所有任务都加进去
    let finalPlan = todayPlan ?? null
    if (!finalPlan) {
      finalPlan = { date: todayStr, taskIds: finalTasks.map(t => t.id) }
      await db.saveDailyPlan(finalPlan)
    }

    const updatedState = { ...appState, streak, level: getLevelFromPoints(appState.totalPoints) }
    await db.saveAppState(updatedState)

    set({
      appState: updatedState,
      tasks: finalTasks,
      rewards: finalRewards,
      redeemRecords,
      todayRecord: todayRecord ?? null,
      todayPlan: finalPlan,
      isLoading: false,
    })
  },

  addTask: async (task) => {
    await db.saveTask(task)
    // 新任务默认加入今日计划
    const { todayPlan } = get()
    const todayStr = today()
    const newPlan: DailyPlan = todayPlan
      ? { ...todayPlan, taskIds: [...todayPlan.taskIds, task.id] }
      : { date: todayStr, taskIds: [task.id] }
    await db.saveDailyPlan(newPlan)
    set(s => ({ tasks: [...s.tasks, task], todayPlan: newPlan }))
  },

  removeTask: async (taskId) => {
    await db.deleteTask(taskId)
    const { todayPlan } = get()
    if (todayPlan) {
      const newPlan = { ...todayPlan, taskIds: todayPlan.taskIds.filter(id => id !== taskId) }
      await db.saveDailyPlan(newPlan)
      set(s => ({ tasks: s.tasks.filter(t => t.id !== taskId), todayPlan: newPlan }))
    } else {
      set(s => ({ tasks: s.tasks.filter(t => t.id !== taskId) }))
    }
  },

  updateTask: async (task) => {
    await db.saveTask(task)
    set(s => ({ tasks: s.tasks.map(t => t.id === task.id ? task : t) }))
  },

  addToTodayPlan: async (taskId) => {
    const { todayPlan } = get()
    const todayStr = today()
    const plan = todayPlan ?? { date: todayStr, taskIds: [] }
    if (plan.taskIds.includes(taskId)) return
    const newPlan = { ...plan, taskIds: [...plan.taskIds, taskId] }
    await db.saveDailyPlan(newPlan)
    set({ todayPlan: newPlan })
  },

  removeFromTodayPlan: async (taskId) => {
    const { todayPlan } = get()
    if (!todayPlan) return
    const newPlan = { ...todayPlan, taskIds: todayPlan.taskIds.filter(id => id !== taskId) }
    await db.saveDailyPlan(newPlan)
    set({ todayPlan: newPlan })
  },

  completeTask: async (taskId) => {
    const { tasks, todayRecord, todayPlan, appState } = get()
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const todayStr = today()
    const record: DailyRecord = todayRecord ?? { date: todayStr, completedTasks: [], completedAt: {}, pointsEarned: 0, bonusPoints: 0 }
    if (record.completedTasks.includes(taskId)) return

    const newCompleted = [...record.completedTasks, taskId]
    const streakBonus = appState.streak >= 7 ? 3 : appState.streak >= 3 ? 2 : 0
    const bonus = Math.floor(task.points * streakBonus / 10)
    const newRecord: DailyRecord = {
      ...record,
      completedTasks: newCompleted,
      completedAt: { ...(record.completedAt ?? {}), [taskId]: nowTime() },
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

    // 检查今日是否全完成
    const planTaskIds = todayPlan?.taskIds ?? []
    const allDone = planTaskIds.length > 0 && planTaskIds.every(id => newCompleted.includes(id))

    await Promise.all([db.saveDailyRecord(newRecord), db.saveAppState(newState)])

    const { MOTIVATIONS } = await import('../data')
    const { PIGGY_QUOTES } = await import('../data/piggyStickers')
    const text = allDone
      ? PIGGY_QUOTES.allDone
      : MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]

    set({ todayRecord: newRecord, appState: newState, showMotivation: true, motivationText: text })
  },

  uncompleteTask: async (taskId) => {
    const { tasks, todayRecord, appState } = get()
    const task = tasks.find(t => t.id === taskId)
    if (!task || !todayRecord) return

    const newCompleted = todayRecord.completedTasks.filter(id => id !== taskId)
    const newCompletedAt = { ...(todayRecord.completedAt ?? {}) }
    delete newCompletedAt[taskId]
    const newRecord: DailyRecord = {
      ...todayRecord,
      completedTasks: newCompleted,
      completedAt: newCompletedAt,
      pointsEarned: Math.max(0, todayRecord.pointsEarned - task.points),
    }
    const newState: AppState = { ...appState, totalPoints: Math.max(0, appState.totalPoints - task.points) }

    await Promise.all([db.saveDailyRecord(newRecord), db.saveAppState(newState)])
    set({ todayRecord: newRecord, appState: newState })
  },

  addReward: async (reward) => {
    await db.saveReward(reward)
    set(s => ({ rewards: [...s.rewards, reward] }))
  },

  removeReward: async (rewardId) => {
    await db.deleteReward(rewardId)
    set(s => ({ rewards: s.rewards.filter(r => r.id !== rewardId) }))
  },

  updateReward: async (reward) => {
    await db.saveReward(reward)
    set(s => ({ rewards: s.rewards.map(r => r.id === reward.id ? reward : r) }))
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

  setCustomBg: async (base64) => {
    const { appState } = get()
    const newState = { ...appState, customBg: base64 }
    await db.saveAppState(newState)
    set({ appState: newState })
  },

  setCustomAvatar: async (base64) => {
    const { appState } = get()
    const newState = { ...appState, customAvatar: base64 }
    await db.saveAppState(newState)
    set({ appState: newState })
  },

  setColorMode: async (mode) => {
    const { appState } = get()
    const newState = { ...appState, colorMode: mode }
    await db.saveAppState(newState)
    set({ appState: newState })
  },

  updateUiSettings: async (patch) => {
    const { appState } = get()
    const current = appState.uiSettings ?? DEFAULT_UI_SETTINGS
    const newState = { ...appState, uiSettings: { ...current, ...patch } }
    await db.saveAppState(newState)
    set({ appState: newState })
  },

  reorderTasks: async (fromIndex, toIndex) => {
    const { tasks, appState } = get()
    const order = appState.taskOrder ?? tasks.map(t => t.id)
    const newOrder = [...order]
    const [moved] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, moved)
    const newState = { ...appState, taskOrder: newOrder }
    await db.saveAppState(newState)
    set({ appState: newState })
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
    set({ appState: newState, todayRecord: null, todayPlan: null, redeemRecords: [] })
  },

  hideMotivation: () => set({ showMotivation: false }),
}))
