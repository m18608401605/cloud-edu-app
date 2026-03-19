import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { THEMES, ACHIEVEMENTS } from '../data'
import { getAllDailyRecords } from '../db'
import type { DailyRecord } from '../types'
import { PIGGY_STICKERS, PIGGY_QUOTES } from '../data/piggyStickers'

export function StatsPage() {
  const { appState, redeemRecords, resetPoints, resetAll } = useStore()
  const theme = THEMES.find(t => t.id === appState.currentTheme)!
  const [records, setRecords] = useState<DailyRecord[]>([])
  const [showReset, setShowReset] = useState(false)
  const [resetType, setResetType] = useState<'points' | 'all'>('points')

  useEffect(() => { getAllDailyRecords().then(setRecords) }, [appState.totalPoints])

  // 最近7天数据
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().split('T')[0]
    const rec = records.find(r => r.date === key)
    return { date: key, label: ['日','一','二','三','四','五','六'][d.getDay()], points: rec?.pointsEarned ?? 0 }
  })
  const maxPoints = Math.max(...last7Days.map(d => d.points), 1)

  // 月度统计
  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthRecords = records.filter(r => r.date.startsWith(thisMonth))
  const monthTotal = monthRecords.reduce((s, r) => s + r.pointsEarned, 0)
  const monthDays = monthRecords.length

  // 成就解锁
  const unlockedAchievements = ACHIEVEMENTS.filter(a => {
    if (a.condition === 'first_task') return records.some(r => r.completedTasks.length > 0)
    if (a.condition === 'streak_3') return appState.streak >= 3
    if (a.condition === 'streak_7') return appState.streak >= 7
    if (a.condition === 'points_100') return appState.totalPoints >= 100
    if (a.condition === 'points_500') return appState.totalPoints >= 500
    if (a.condition === 'points_1000') return appState.totalPoints >= 1000
    if (a.condition === 'redeem_1') return redeemRecords.length >= 1
    return false
  })

  const handleReset = async () => {
    if (resetType === 'points') await resetPoints()
    else await resetAll()
    setShowReset(false)
  }

  return (
    <div className="relative z-10 px-4 space-y-4">
      {/* 月度总结 */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-black">📊 本月总结</span>
          <span className="text-gray-500 text-xs">{thisMonth}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '获得积分', value: monthTotal, icon: '⚡', color: theme.accent },
            { label: '活跃天数', value: monthDays, icon: '📅', color: theme.primary },
            { label: '兑换次数', value: redeemRecords.filter(r => r.date.startsWith(thisMonth)).length, icon: '🎁', color: theme.secondary },
          ].map(item => (
            <div key={item.label} className="text-center rounded-xl p-3"
              style={{ background: `${item.color}11`, border: `1px solid ${item.color}33` }}>
              <div className="text-2xl">{item.icon}</div>
              <div className="font-black text-xl" style={{ color: item.color }}>{item.value}</div>
              <div className="text-gray-500 text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 猪猪侠鼓励语 */}
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.06), rgba(255,45,120,0.04))', border: '1px solid rgba(0,255,255,0.2)' }}>
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
          style={{ border: '2px solid #00ffff', boxShadow: '0 0 12px #00ffff44' }}>
          <img src="/cloud-edu-app/kids-points/piggy.png" alt="猪猪侠"
            className="w-full h-full object-cover object-top"
            style={{ transform: 'scale(1.1) translateY(5%)' }} />
        </div>
        <div>
          <div className="font-black text-sm cyber-title" style={{ color: '#00ffff' }}>猪猪侠说：</div>
          <div className="text-gray-300 text-sm mt-0.5">{PIGGY_QUOTES.encourage}</div>
        </div>
      </motion.div>

      {/* 近7天柱状图 */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-white font-black mb-4">📈 近7天积分</div>
        <div className="flex items-end justify-between gap-2 h-24">
          {last7Days.map((day, i) => (
            <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-xs font-bold" style={{ color: theme.primary }}>
                {day.points > 0 ? day.points : ''}
              </div>
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${(day.points / maxPoints) * 80}px` }}
                transition={{ delay: i * 0.05, duration: 0.6, ease: 'easeOut' }}
                className="w-full rounded-t-lg min-h-[4px]"
                style={{
                  background: day.points > 0
                    ? `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})`
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: day.points > 0 ? `0 0 8px ${theme.primary}66` : 'none',
                }}
              />
              <div className="text-gray-500 text-xs">周{day.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 成就徽章 */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-white font-black mb-3">🏆 成就徽章 ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</div>
        <div className="grid grid-cols-4 gap-2">
          {ACHIEVEMENTS.map(achievement => {
            const unlocked = unlockedAchievements.some(a => a.id === achievement.id)
            return (
              <motion.div key={achievement.id}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl"
                style={{
                  background: unlocked ? `${theme.accent}11` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${unlocked ? theme.accent + '44' : 'rgba(255,255,255,0.06)'}`,
                  opacity: unlocked ? 1 : 0.4,
                }}>
                <div className="text-2xl">{unlocked ? achievement.icon : '🔒'}</div>
                <div className="text-xs text-center font-bold leading-tight"
                  style={{ color: unlocked ? theme.accent : '#555' }}>
                  {achievement.title}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 重置积分 */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.15)' }}>
        <div className="text-white font-black mb-3 flex items-center gap-2">
          <span>{PIGGY_STICKERS.think}</span> 重置设置
        </div>
        <div className="space-y-2">
          <button onClick={() => { setResetType('points'); setShowReset(true) }}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-red-400 border border-red-500/30 bg-red-500/10">
            🔄 重置积分（保留历史记录）
          </button>
          <button onClick={() => { setResetType('all'); setShowReset(true) }}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-red-500 border border-red-600/30 bg-red-600/10">
            ⚠️ 清空所有数据（慎用！）
          </button>
        </div>
      </div>

      {/* 确认弹窗 */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="mx-6 p-6 rounded-2xl text-center max-w-sm w-full"
            style={{ background: '#1a0a3e', border: '1px solid rgba(255,80,80,0.4)' }}>
            <div className="text-5xl mb-3">{PIGGY_STICKERS.shocked}</div>
            <div className="text-white font-black text-lg mb-2">
              {resetType === 'points' ? '确定要重置积分吗？' : '确定清空所有数据吗？'}
            </div>
            <div className="text-gray-400 text-sm mb-5">
              {resetType === 'points' ? '积分将归零，历史记录保留' : '所有数据将永久删除，不可恢复！'}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)}
                className="flex-1 py-3 rounded-xl font-black text-gray-400 bg-white/5">取消</button>
              <button onClick={handleReset}
                className="flex-1 py-3 rounded-xl font-black text-white bg-red-600">确认</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
