import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import type {
  AppSession,
  AppState,
  BackupData,
  ChildProfile,
  DailyPlan,
  DailyRecord,
  ProfileSnapshot,
  RedeemRecord,
  Reward,
  Task,
  UserAccount,
  VoiceSession,
} from '../types'
import { DEFAULT_REWARDS, DEFAULT_TASKS, getDefaultAppState } from '../data'

interface KidsDB extends DBSchema {
  tasks: { key: string; value: Task }
  dailyPlans: { key: string; value: DailyPlan }
  dailyRecords: { key: string; value: DailyRecord }
  rewards: { key: string; value: Reward }
  redeemRecords: { key: string; value: RedeemRecord }
  appState: { key: string; value: AppState & { id: 'main' } }
  users: { key: string; value: UserAccount }
  childProfiles: { key: string; value: ChildProfile }
  profileSnapshots: { key: string; value: ProfileSnapshot }
  voiceSessions: { key: string; value: VoiceSession }
}

const DB_NAME = 'KidsPointsDB'
const DB_VERSION = 3
const SESSION_STORAGE_KEY = 'kids-points-session'

let db: IDBPDatabase<KidsDB>

export async function getDB() {
  if (!db) {
    db = await openDB<KidsDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        const ensureStore = (
          name: 'tasks' | 'dailyPlans' | 'dailyRecords' | 'rewards' | 'redeemRecords' | 'appState' | 'users' | 'childProfiles' | 'profileSnapshots' | 'voiceSessions',
          keyPath: string,
        ) => {
          if (!database.objectStoreNames.contains(name)) {
            database.createObjectStore(name, { keyPath })
          }
        }

        ensureStore('tasks', 'id')
        ensureStore('dailyPlans', 'date')
        ensureStore('dailyRecords', 'date')
        ensureStore('rewards', 'id')
        ensureStore('redeemRecords', 'id')
        ensureStore('appState', 'id')
        ensureStore('users', 'id')
        ensureStore('childProfiles', 'id')
        ensureStore('profileSnapshots', 'profileId')
        ensureStore('voiceSessions', 'id')
      },
    })
  }
  return db
}

export async function getAppState(): Promise<AppState> {
  const database = await getDB()
  const state = await database.get('appState', 'main')
  if (!state) return getDefaultAppState()
  const { id, ...appState } = state
  void id
  return appState
}

export async function saveAppState(state: AppState) {
  const database = await getDB()
  await database.put('appState', { ...state, id: 'main' })
}

export async function getTasks(): Promise<Task[]> {
  const database = await getDB()
  return database.getAll('tasks')
}

export async function saveTask(task: Task) {
  const database = await getDB()
  await database.put('tasks', task)
}

export async function deleteTask(id: string) {
  const database = await getDB()
  await database.delete('tasks', id)
}

export async function getDailyPlan(date: string): Promise<DailyPlan | undefined> {
  const database = await getDB()
  return database.get('dailyPlans', date)
}

export async function saveDailyPlan(plan: DailyPlan) {
  const database = await getDB()
  await database.put('dailyPlans', plan)
}

export async function getAllDailyPlans(): Promise<DailyPlan[]> {
  const database = await getDB()
  return database.getAll('dailyPlans')
}

export async function getDailyRecord(date: string): Promise<DailyRecord | undefined> {
  const database = await getDB()
  return database.get('dailyRecords', date)
}

export async function saveDailyRecord(record: DailyRecord) {
  const database = await getDB()
  await database.put('dailyRecords', record)
}

export async function getAllDailyRecords(): Promise<DailyRecord[]> {
  const database = await getDB()
  return database.getAll('dailyRecords')
}

export async function getRewards(): Promise<Reward[]> {
  const database = await getDB()
  return database.getAll('rewards')
}

export async function saveReward(reward: Reward) {
  const database = await getDB()
  await database.put('rewards', reward)
}

export async function deleteReward(id: string) {
  const database = await getDB()
  await database.delete('rewards', id)
}

export async function addRedeemRecord(record: RedeemRecord) {
  const database = await getDB()
  await database.put('redeemRecords', record)
}

export async function getAllRedeemRecords(): Promise<RedeemRecord[]> {
  const database = await getDB()
  return database.getAll('redeemRecords')
}

export async function getUsers(): Promise<UserAccount[]> {
  const database = await getDB()
  return database.getAll('users')
}

export async function getUserByEmail(email: string): Promise<UserAccount | undefined> {
  const users = await getUsers()
  return users.find(user => user.email.toLowerCase() === email.toLowerCase())
}

export async function saveUser(user: UserAccount) {
  const database = await getDB()
  await database.put('users', user)
}

export async function getChildProfiles(userId: string): Promise<ChildProfile[]> {
  const database = await getDB()
  const profiles = await database.getAll('childProfiles')
  return profiles.filter(profile => profile.userId === userId)
}

export async function saveChildProfile(profile: ChildProfile) {
  const database = await getDB()
  await database.put('childProfiles', profile)
}

export async function deleteChildProfile(profileId: string) {
  const database = await getDB()
  await database.delete('childProfiles', profileId)
  await database.delete('profileSnapshots', profileId)
  const voiceSessions = await database.getAll('voiceSessions')
  for (const session of voiceSessions.filter(item => item.profileId === profileId)) {
    await database.delete('voiceSessions', session.id)
  }
}

export async function getProfileSnapshot(profileId: string): Promise<ProfileSnapshot | undefined> {
  const database = await getDB()
  return database.get('profileSnapshots', profileId)
}

export async function saveProfileSnapshot(profileId: string, backup: BackupData) {
  const database = await getDB()
  await database.put('profileSnapshots', { profileId, backup, updatedAt: new Date().toISOString() })
}

export async function getVoiceSessions(profileId: string): Promise<VoiceSession[]> {
  const database = await getDB()
  const sessions = await database.getAll('voiceSessions')
  return sessions
    .filter(session => session.profileId === profileId)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
}

export async function saveVoiceSession(session: VoiceSession) {
  const database = await getDB()
  await database.put('voiceSessions', session)
}

export async function deleteVoiceSession(sessionId: string) {
  const database = await getDB()
  await database.delete('voiceSessions', sessionId)
}

export function getSession(): AppSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AppSession
  } catch {
    return null
  }
}

export function saveSession(session: AppSession | null) {
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export async function exportBackupData(): Promise<BackupData> {
  const database = await getDB()
  const [appState, tasks, dailyPlans, dailyRecords, rewards, redeemRecords, users, childProfiles, profileSnapshots, voiceSessions] = await Promise.all([
    getAppState(),
    getTasks(),
    getAllDailyPlans(),
    getAllDailyRecords(),
    getRewards(),
    getAllRedeemRecords(),
    database.getAll('users'),
    database.getAll('childProfiles'),
    database.getAll('profileSnapshots'),
    database.getAll('voiceSessions'),
  ])

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: 'kids-points-system',
    data: { appState, tasks, dailyPlans, dailyRecords, rewards, redeemRecords, users, childProfiles, profileSnapshots, voiceSessions, session: getSession() },
  }
}

async function clearCoreData(database: IDBPDatabase<KidsDB>) {
  await database.clear('tasks')
  await database.clear('dailyPlans')
  await database.clear('dailyRecords')
  await database.clear('rewards')
  await database.clear('redeemRecords')
  await database.clear('appState')
}

export async function importBackupData(backup: BackupData) {
  if (backup.source !== 'kids-points-system') {
    throw new Error('备份文件来源不正确')
  }

  const database = await getDB()
  await clearCoreData(database)
  await database.clear('users')
  await database.clear('childProfiles')
  await database.clear('profileSnapshots')
  await database.clear('voiceSessions')

  for (const task of backup.data.tasks) await database.put('tasks', task)
  for (const plan of backup.data.dailyPlans) await database.put('dailyPlans', plan)
  for (const record of backup.data.dailyRecords) await database.put('dailyRecords', record)
  for (const reward of backup.data.rewards) await database.put('rewards', reward)
  for (const redeemRecord of backup.data.redeemRecords) await database.put('redeemRecords', redeemRecord)
  for (const user of backup.data.users ?? []) await database.put('users', user)
  for (const childProfile of backup.data.childProfiles ?? []) await database.put('childProfiles', childProfile)
  for (const profileSnapshot of backup.data.profileSnapshots ?? []) await database.put('profileSnapshots', profileSnapshot)
  for (const voiceSession of backup.data.voiceSessions ?? []) await database.put('voiceSessions', voiceSession)
  await saveAppState(backup.data.appState ?? getDefaultAppState())
  saveSession(backup.data.session ?? null)
}

export async function replaceCoreDataWithDefaults() {
  const database = await getDB()
  await clearCoreData(database)
  for (const task of DEFAULT_TASKS) await database.put('tasks', task)
  for (const reward of DEFAULT_REWARDS) await database.put('rewards', reward)
  await saveAppState(getDefaultAppState())
}

export async function ensureCoreDefaults() {
  const [tasks, rewards, appState] = await Promise.all([getTasks(), getRewards(), getAppState()])
  if (tasks.length === 0) {
    for (const task of DEFAULT_TASKS) await saveTask(task)
  }
  if (rewards.length === 0) {
    for (const reward of DEFAULT_REWARDS) await saveReward(reward)
  }
  if (!appState.currentTheme) {
    await saveAppState(getDefaultAppState())
  }
}

export async function resetPoints() {
  const state = await getAppState()
  await saveAppState({ ...state, totalPoints: 0, level: 1 })
}

export async function resetAllData() {
  await replaceCoreDataWithDefaults()
}
