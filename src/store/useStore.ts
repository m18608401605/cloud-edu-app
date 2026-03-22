import { create } from 'zustand'
import type {
  AppState,
  BackupData,
  ChildProfile,
  DailyPlan,
  DailyRecord,
  RedeemRecord,
  Reward,
  Task,
  ThemeId,
  UiSettings,
  UserAccount,
  VoiceAnalysisInput,
  VoiceSession,
} from '../types'
import * as db from '../db'
import { analyzeVoiceTranscript, DEFAULT_REWARDS, DEFAULT_TASKS, getDefaultAppState, getLevelFromPoints, THEMES } from '../data'

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

const today = () => new Date().toLocaleDateString('sv-SE')
const nowTime = () => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

interface RegisterInput {
  email: string
  password: string
  name: string
}

interface LoginInput {
  email: string
  password: string
}

interface ChildProfileInput {
  name: string
  age: number
  grade: string
  avatarEmoji: string
  target: string
  focusSubjects: ChildProfile['focusSubjects']
  focusCapabilities: ChildProfile['focusCapabilities']
}

interface Store {
  appState: AppState
  tasks: Task[]
  todayPlan: DailyPlan | null
  todayRecord: DailyRecord | null
  rewards: Reward[]
  redeemRecords: RedeemRecord[]
  voiceSessions: VoiceSession[]
  currentUser: UserAccount | null
  childProfiles: ChildProfile[]
  activeProfileId: string | null
  isLoading: boolean
  showMotivation: boolean
  motivationText: string

  init: () => Promise<void>
  register: (input: RegisterInput) => Promise<{ ok: boolean; message: string }>
  login: (input: LoginInput) => Promise<{ ok: boolean; message: string }>
  logout: () => Promise<void>
  createChildProfile: (input: ChildProfileInput) => Promise<void>
  updateChildProfile: (profileId: string, input: ChildProfileInput) => Promise<void>
  deleteChildProfile: (profileId: string) => Promise<void>
  switchProfile: (profileId: string) => Promise<void>

  addTask: (task: Task) => Promise<void>
  removeTask: (taskId: string) => Promise<void>
  updateTask: (task: Task) => Promise<void>
  addToTodayPlan: (taskId: string) => Promise<void>
  removeFromTodayPlan: (taskId: string) => Promise<void>
  completeTask: (taskId: string) => Promise<void>
  uncompleteTask: (taskId: string) => Promise<void>

  addReward: (reward: Reward) => Promise<void>
  removeReward: (rewardId: string) => Promise<void>
  updateReward: (reward: Reward) => Promise<void>
  redeemReward: (reward: Reward) => Promise<boolean>

  createVoiceSession: (input: VoiceAnalysisInput) => Promise<void>
  deleteVoiceSession: (sessionId: string) => Promise<void>

  setTheme: (themeId: ThemeId) => Promise<void>
  unlockTheme: (themeId: ThemeId) => Promise<boolean>
  setCustomBg: (base64: string | undefined) => Promise<void>
  setCustomAvatar: (base64: string | undefined) => Promise<void>
  setColorMode: (mode: 'dark' | 'light') => Promise<void>
  updateUiSettings: (patch: Partial<UiSettings>) => Promise<void>
  reorderTasks: (fromIndex: number, toIndex: number) => Promise<void>

  resetPoints: () => Promise<void>
  resetAll: () => Promise<void>
  exportBackup: () => Promise<BackupData>
  importBackup: (backup: BackupData) => Promise<void>
  hideMotivation: () => void
}

function buildDefaultPlan(tasks: Task[]): DailyPlan {
  return { date: today(), taskIds: tasks.map(task => task.id) }
}

async function loadCoreState() {
  await db.ensureCoreDefaults()

  const [appStateLoaded, tasksLoaded, rewardsLoaded, redeemRecords] = await Promise.all([
    db.getAppState(),
    db.getTasks(),
    db.getRewards(),
    db.getAllRedeemRecords(),
  ])

  let appState = appStateLoaded
  let tasks = tasksLoaded
  let rewards = rewardsLoaded

  if (tasks.length === 0) {
    for (const task of DEFAULT_TASKS) await db.saveTask(task)
    tasks = DEFAULT_TASKS
  }
  if (rewards.length === 0) {
    for (const reward of DEFAULT_REWARDS) await db.saveReward(reward)
    rewards = DEFAULT_REWARDS
  }

  const todayStr = today()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toLocaleDateString('sv-SE')
  const streak = appState.lastActiveDate !== todayStr && appState.lastActiveDate !== yesterdayStr ? 0 : appState.streak

  const [todayRecord, todayPlan] = await Promise.all([
    db.getDailyRecord(todayStr),
    db.getDailyPlan(todayStr),
  ])

  let finalPlan = todayPlan ?? null
  if (!finalPlan) {
    finalPlan = buildDefaultPlan(tasks)
    await db.saveDailyPlan(finalPlan)
  }

  appState = { ...appState, streak, level: getLevelFromPoints(appState.totalPoints) }
  await db.saveAppState(appState)

  return {
    appState,
    tasks,
    rewards,
    redeemRecords,
    todayRecord: todayRecord ?? null,
    todayPlan: finalPlan,
  }
}

export const useStore = create<Store>((set, get) => {
  const syncActiveProfileSnapshot = async () => {
    const { activeProfileId } = get()
    if (!activeProfileId) return
    const backup = await db.exportBackupData()
    await db.saveProfileSnapshot(activeProfileId, backup)
  }

  const refreshVoiceSessions = async () => {
    const { activeProfileId } = get()
    if (!activeProfileId) {
      set({ voiceSessions: [] })
      return
    }
    const voiceSessions = await db.getVoiceSessions(activeProfileId)
    set({ voiceSessions })
  }

  const refreshUserContext = async (user: UserAccount | null, activeProfileId: string | null) => {
    if (!user) {
      db.saveSession(null)
      set({ currentUser: null, childProfiles: [], activeProfileId: null, voiceSessions: [] })
      return
    }

    const childProfiles = await db.getChildProfiles(user.id)
    const safeProfileId = activeProfileId && childProfiles.some(profile => profile.id === activeProfileId)
      ? activeProfileId
      : childProfiles[0]?.id ?? null

    db.saveSession({ userId: user.id, activeProfileId: safeProfileId ?? undefined })
    set({ currentUser: user, childProfiles, activeProfileId: safeProfileId })

    if (safeProfileId) {
      const snapshot = await db.getProfileSnapshot(safeProfileId)
      if (snapshot) await db.importBackupData(snapshot.backup)
      else await db.replaceCoreDataWithDefaults()
    } else {
      await db.replaceCoreDataWithDefaults()
    }

    const core = await loadCoreState()
    const voiceSessions = safeProfileId ? await db.getVoiceSessions(safeProfileId) : []
    set({ ...core, voiceSessions, isLoading: false })
  }

  const afterDataMutation = async (patch?: Partial<Store>) => {
    if (patch) set(patch)
    await syncActiveProfileSnapshot()
  }

  return {
    appState: getDefaultAppState(),
    tasks: [],
    todayPlan: null,
    todayRecord: null,
    rewards: [],
    redeemRecords: [],
    voiceSessions: [],
    currentUser: null,
    childProfiles: [],
    activeProfileId: null,
    isLoading: true,
    showMotivation: false,
    motivationText: '',

    init: async () => {
      set({ isLoading: true })
      const core = await loadCoreState()
      const session = db.getSession()
      if (!session) {
        set({ ...core, currentUser: null, childProfiles: [], activeProfileId: null, voiceSessions: [], isLoading: false })
        return
      }

      const users = await db.getUsers()
      const user = users.find(item => item.id === session.userId) ?? null
      if (!user) {
        db.saveSession(null)
        set({ ...core, currentUser: null, childProfiles: [], activeProfileId: null, voiceSessions: [], isLoading: false })
        return
      }

      await refreshUserContext(user, session.activeProfileId ?? null)
    },

    register: async ({ email, password, name }) => {
      if (!email.trim() || !password.trim() || !name.trim()) {
        return { ok: false, message: '请完整填写姓名、邮箱和密码' }
      }
      const exists = await db.getUserByEmail(email)
      if (exists) return { ok: false, message: '该邮箱已经注册过' }

      const user: UserAccount = {
        id: `user-${Date.now()}`,
        email: email.trim(),
        password,
        name: name.trim(),
        createdAt: new Date().toISOString(),
      }
      await db.saveUser(user)
      await refreshUserContext(user, null)
      return { ok: true, message: '账号已创建，请添加孩子档案' }
    },

    login: async ({ email, password }) => {
      const user = await db.getUserByEmail(email)
      if (!user || user.password !== password) {
        return { ok: false, message: '邮箱或密码不正确' }
      }
      await refreshUserContext(user, db.getSession()?.activeProfileId ?? null)
      return { ok: true, message: '登录成功' }
    },

    logout: async () => {
      await syncActiveProfileSnapshot()
      db.saveSession(null)
      const core = await loadCoreState()
      set({ ...core, currentUser: null, childProfiles: [], activeProfileId: null, voiceSessions: [], isLoading: false })
    },

    createChildProfile: async input => {
      const { currentUser } = get()
      if (!currentUser) return
      const profile: ChildProfile = {
        id: `profile-${Date.now()}`,
        userId: currentUser.id,
        name: input.name.trim(),
        age: input.age,
        grade: input.grade.trim(),
        avatarEmoji: input.avatarEmoji.trim() || '🦸',
        target: input.target.trim(),
        focusSubjects: input.focusSubjects,
        focusCapabilities: input.focusCapabilities,
        createdAt: new Date().toISOString(),
      }
      await db.saveChildProfile(profile)
      await refreshUserContext(currentUser, profile.id)
      await syncActiveProfileSnapshot()
    },

    updateChildProfile: async (profileId, input) => {
      const { currentUser, childProfiles } = get()
      if (!currentUser) return
      const profile = childProfiles.find(item => item.id === profileId)
      if (!profile) return
      await db.saveChildProfile({
        ...profile,
        ...input,
        name: input.name.trim(),
        grade: input.grade.trim(),
        avatarEmoji: input.avatarEmoji.trim() || profile.avatarEmoji,
        target: input.target.trim(),
      })
      await refreshUserContext(currentUser, get().activeProfileId)
    },

    deleteChildProfile: async profileId => {
      const { currentUser, activeProfileId, childProfiles } = get()
      if (!currentUser) return
      await syncActiveProfileSnapshot()
      await db.deleteChildProfile(profileId)
      const remaining = childProfiles.filter(profile => profile.id !== profileId)
      await refreshUserContext(currentUser, activeProfileId === profileId ? remaining[0]?.id ?? null : activeProfileId)
    },

    switchProfile: async profileId => {
      const { currentUser } = get()
      if (!currentUser) return
      await syncActiveProfileSnapshot()
      await refreshUserContext(currentUser, profileId)
    },

    addTask: async task => {
      await db.saveTask(task)
      const { todayPlan } = get()
      const newPlan = todayPlan
        ? { ...todayPlan, taskIds: [...todayPlan.taskIds, task.id] }
        : { date: today(), taskIds: [task.id] }
      await db.saveDailyPlan(newPlan)
      set(state => ({ tasks: [...state.tasks, task], todayPlan: newPlan }))
      await afterDataMutation()
    },

    removeTask: async taskId => {
      await db.deleteTask(taskId)
      const { todayPlan } = get()
      if (todayPlan) {
        const newPlan = { ...todayPlan, taskIds: todayPlan.taskIds.filter(id => id !== taskId) }
        await db.saveDailyPlan(newPlan)
        set(state => ({ tasks: state.tasks.filter(task => task.id !== taskId), todayPlan: newPlan }))
      } else {
        set(state => ({ tasks: state.tasks.filter(task => task.id !== taskId) }))
      }
      await afterDataMutation()
    },

    updateTask: async task => {
      await db.saveTask(task)
      set(state => ({ tasks: state.tasks.map(item => item.id === task.id ? task : item) }))
      await afterDataMutation()
    },

    addToTodayPlan: async taskId => {
      const { todayPlan } = get()
      const plan = todayPlan ?? { date: today(), taskIds: [] }
      if (plan.taskIds.includes(taskId)) return
      const newPlan = { ...plan, taskIds: [...plan.taskIds, taskId] }
      await db.saveDailyPlan(newPlan)
      set({ todayPlan: newPlan })
      await afterDataMutation()
    },

    removeFromTodayPlan: async taskId => {
      const { todayPlan } = get()
      if (!todayPlan) return
      const newPlan = { ...todayPlan, taskIds: todayPlan.taskIds.filter(id => id !== taskId) }
      await db.saveDailyPlan(newPlan)
      set({ todayPlan: newPlan })
      await afterDataMutation()
    },

    completeTask: async taskId => {
      const { tasks, todayRecord, todayPlan, appState } = get()
      const task = tasks.find(item => item.id === taskId)
      if (!task) return
      const todayStr = today()
      const record: DailyRecord = todayRecord ?? { date: todayStr, completedTasks: [], completedAt: {}, pointsEarned: 0, bonusPoints: 0 }
      if (record.completedTasks.includes(taskId)) return

      const streakBonus = appState.streak >= 7 ? 3 : appState.streak >= 3 ? 2 : 0
      const bonus = Math.floor(task.points * streakBonus / 10)
      const newCompleted = [...record.completedTasks, taskId]
      const newRecord: DailyRecord = {
        ...record,
        completedTasks: newCompleted,
        completedAt: { ...record.completedAt, [taskId]: nowTime() },
        pointsEarned: record.pointsEarned + task.points,
        bonusPoints: record.bonusPoints + bonus,
      }

      const newTotal = appState.totalPoints + task.points + bonus
      const newState: AppState = {
        ...appState,
        totalPoints: newTotal,
        streak: appState.lastActiveDate !== todayStr ? appState.streak + 1 : appState.streak,
        level: getLevelFromPoints(newTotal),
        lastActiveDate: todayStr,
      }

      const planTaskIds = todayPlan?.taskIds ?? []
      const allDone = planTaskIds.length > 0 && planTaskIds.every(id => newCompleted.includes(id))
      await Promise.all([db.saveDailyRecord(newRecord), db.saveAppState(newState)])
      set({
        todayRecord: newRecord,
        appState: newState,
        showMotivation: true,
        motivationText: allDone ? '今日任务全部完成，成长值满格！' : '完成一项任务，成长进度继续提升！',
      })
      await afterDataMutation()
    },

    uncompleteTask: async taskId => {
      const { tasks, todayRecord, appState } = get()
      const task = tasks.find(item => item.id === taskId)
      if (!task || !todayRecord) return
      const streakBonus = appState.streak >= 7 ? 3 : appState.streak >= 3 ? 2 : 0
      const bonus = Math.floor(task.points * streakBonus / 10)
      const newCompleted = todayRecord.completedTasks.filter(id => id !== taskId)
      const newCompletedAt = { ...todayRecord.completedAt }
      delete newCompletedAt[taskId]
      const newRecord: DailyRecord = {
        ...todayRecord,
        completedTasks: newCompleted,
        completedAt: newCompletedAt,
        pointsEarned: Math.max(0, todayRecord.pointsEarned - task.points),
        bonusPoints: Math.max(0, todayRecord.bonusPoints - bonus),
      }
      const newTotal = Math.max(0, appState.totalPoints - task.points - bonus)
      const newState = { ...appState, totalPoints: newTotal, level: getLevelFromPoints(newTotal) }
      await Promise.all([db.saveDailyRecord(newRecord), db.saveAppState(newState)])
      set({ todayRecord: newRecord, appState: newState })
      await afterDataMutation()
    },

    addReward: async reward => {
      await db.saveReward(reward)
      set(state => ({ rewards: [...state.rewards, reward] }))
      await afterDataMutation()
    },

    removeReward: async rewardId => {
      await db.deleteReward(rewardId)
      set(state => ({ rewards: state.rewards.filter(reward => reward.id !== rewardId) }))
      await afterDataMutation()
    },

    updateReward: async reward => {
      await db.saveReward(reward)
      set(state => ({ rewards: state.rewards.map(item => item.id === reward.id ? reward : item) }))
      await afterDataMutation()
    },

    redeemReward: async reward => {
      const { appState } = get()
      if (appState.totalPoints < reward.cost) return false
      const record = {
        id: `redeem-${Date.now()}`,
        rewardId: reward.id,
        rewardTitle: reward.title,
        cost: reward.cost,
        date: today(),
      }
      const newState = { ...appState, totalPoints: appState.totalPoints - reward.cost, level: getLevelFromPoints(appState.totalPoints - reward.cost) }
      await Promise.all([db.addRedeemRecord(record), db.saveAppState(newState)])
      set(state => ({ appState: newState, redeemRecords: [...state.redeemRecords, record] }))
      await afterDataMutation()
      return true
    },

    createVoiceSession: async input => {
      const { currentUser, activeProfileId } = get()
      if (!currentUser || !activeProfileId) return
      const analysis = analyzeVoiceTranscript(input)
      const session: VoiceSession = {
        ...analysis,
        id: `voice-${Date.now()}`,
        userId: currentUser.id,
        profileId: activeProfileId,
        recordedAt: new Date().toISOString(),
      }
      await db.saveVoiceSession(session)
      await refreshVoiceSessions()
    },

    deleteVoiceSession: async sessionId => {
      await db.deleteVoiceSession(sessionId)
      await refreshVoiceSessions()
    },

    setTheme: async themeId => {
      const { appState } = get()
      if (!appState.unlockedThemes.includes(themeId)) return
      const newState = { ...appState, currentTheme: themeId }
      await db.saveAppState(newState)
      set({ appState: newState })
      await afterDataMutation()
    },

    unlockTheme: async themeId => {
      const { appState } = get()
      const theme = THEMES.find(item => item.id === themeId)
      if (!theme || appState.totalPoints < theme.unlockCost) return false
      if (appState.unlockedThemes.includes(themeId)) return true
      const newState = {
        ...appState,
        totalPoints: appState.totalPoints - theme.unlockCost,
        unlockedThemes: [...appState.unlockedThemes, themeId],
        level: getLevelFromPoints(appState.totalPoints - theme.unlockCost),
      }
      await db.saveAppState(newState)
      set({ appState: newState })
      await afterDataMutation()
      return true
    },

    setCustomBg: async base64 => {
      const { appState } = get()
      const newState = { ...appState, customBg: base64 }
      await db.saveAppState(newState)
      set({ appState: newState })
      await afterDataMutation()
    },

    setCustomAvatar: async base64 => {
      const { appState } = get()
      const newState = { ...appState, customAvatar: base64 }
      await db.saveAppState(newState)
      set({ appState: newState })
      await afterDataMutation()
    },

    setColorMode: async mode => {
      const { appState } = get()
      const newState = { ...appState, colorMode: mode }
      await db.saveAppState(newState)
      set({ appState: newState })
      await afterDataMutation()
    },

    updateUiSettings: async patch => {
      const { appState } = get()
      const current = appState.uiSettings ?? DEFAULT_UI_SETTINGS
      const newState = { ...appState, uiSettings: { ...current, ...patch } }
      await db.saveAppState(newState)
      set({ appState: newState })
      await afterDataMutation()
    },

    reorderTasks: async (fromIndex, toIndex) => {
      const { tasks, appState } = get()
      const order = appState.taskOrder ?? tasks.map(task => task.id)
      const newOrder = [...order]
      const [moved] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, moved)
      const newState = { ...appState, taskOrder: newOrder }
      await db.saveAppState(newState)
      set({ appState: newState })
      await afterDataMutation()
    },

    resetPoints: async () => {
      const { appState } = get()
      const newState = { ...appState, totalPoints: 0, level: 1 }
      await db.saveAppState(newState)
      set({ appState: newState })
      await afterDataMutation()
    },

    resetAll: async () => {
      set({ isLoading: true })
      await db.resetAllData()
      const core = await loadCoreState()
      set({ ...core, isLoading: false })
      await afterDataMutation()
    },

    exportBackup: async () => db.exportBackupData(),

    importBackup: async backup => {
      set({ isLoading: true })
      await db.importBackupData(backup)
      await get().init()
      await syncActiveProfileSnapshot()
    },

    hideMotivation: () => set({ showMotivation: false }),
  }
})
