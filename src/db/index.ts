import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import type { Task, DailyRecord, Reward, RedeemRecord, AppState } from '../types'

interface KidsDB extends DBSchema {
  tasks: { key: string; value: Task }
  dailyRecords: { key: string; value: DailyRecord }
  rewards: { key: string; value: Reward }
  redeemRecords: { key: string; value: RedeemRecord }
  appState: { key: string; value: AppState }
}

let db: IDBPDatabase<KidsDB>

export async function getDB() {
  if (!db) {
    db = await openDB<KidsDB>('KidsPointsDB', 1, {
      upgrade(db) {
        db.createObjectStore('tasks', { keyPath: 'id' })
        db.createObjectStore('dailyRecords', { keyPath: 'date' })
        db.createObjectStore('rewards', { keyPath: 'id' })
        db.createObjectStore('redeemRecords', { keyPath: 'id' })
        db.createObjectStore('appState', { keyPath: 'id' } as any)
      },
    })
  }
  return db
}

export async function getAppState(): Promise<AppState> {
  const db = await getDB()
  const state = await db.get('appState', 'main' as any)
  return state ?? {
    totalPoints: 0,
    streak: 0,
    level: 1,
    lastActiveDate: '',
    unlockedThemes: ['piggy'],
    currentTheme: 'piggy',
  }
}

export async function saveAppState(state: AppState) {
  const db = await getDB()
  await db.put('appState', { ...state, id: 'main' } as any)
}

export async function getTasks(): Promise<Task[]> {
  const db = await getDB()
  return db.getAll('tasks')
}

export async function saveTask(task: Task) {
  const db = await getDB()
  await db.put('tasks', task)
}

export async function deleteTask(id: string) {
  const db = await getDB()
  await db.delete('tasks', id)
}

export async function getDailyRecord(date: string): Promise<DailyRecord | undefined> {
  const db = await getDB()
  return db.get('dailyRecords', date)
}

export async function saveDailyRecord(record: DailyRecord) {
  const db = await getDB()
  await db.put('dailyRecords', record)
}

export async function getAllDailyRecords(): Promise<DailyRecord[]> {
  const db = await getDB()
  return db.getAll('dailyRecords')
}

export async function getRewards(): Promise<Reward[]> {
  const db = await getDB()
  return db.getAll('rewards')
}

export async function saveReward(reward: Reward) {
  const db = await getDB()
  await db.put('rewards', reward)
}

export async function deleteReward(id: string) {
  const db = await getDB()
  await db.delete('rewards', id)
}

export async function addRedeemRecord(record: RedeemRecord) {
  const db = await getDB()
  await db.put('redeemRecords', record)
}

export async function getAllRedeemRecords(): Promise<RedeemRecord[]> {
  const db = await getDB()
  return db.getAll('redeemRecords')
}

// 重置积分（保留历史记录）
export async function resetPoints() {
  const state = await getAppState()
  await saveAppState({ ...state, totalPoints: 0 })
}

// 完全重置所有数据
export async function resetAllData() {
  const db = await getDB()
  await db.clear('dailyRecords')
  await db.clear('redeemRecords')
  await saveAppState({
    totalPoints: 0,
    streak: 0,
    level: 1,
    lastActiveDate: '',
    unlockedThemes: ['piggy'],
    currentTheme: 'piggy',
  })
}
