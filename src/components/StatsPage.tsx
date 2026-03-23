import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ACHIEVEMENTS, THEMES } from '../data'
import { PIGGY_STICKERS, PIGGY_QUOTES } from '../data/piggyStickers'
import { getAllDailyRecords } from '../db'
import { useStore } from '../store/useStore'
import type { BackupData, DailyRecord } from '../types'

export function StatsPage() {
  const {
    appState,
    redeemRecords,
    resetPoints,
    resetAll,
    exportBackup,
    importBackup,
    tasks,
  } = useStore()
  const theme = THEMES.find(item => item.id === appState.currentTheme) ?? THEMES[0]
  const [records, setRecords] = useState<DailyRecord[]>([])
  const [showReset, setShowReset] = useState(false)
  const [resetType, setResetType] = useState<'points' | 'all'>('points')
  const [backupStatus, setBackupStatus] = useState('')
  const [isBackupBusy, setIsBackupBusy] = useState(false)
  const importInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getAllDailyRecords().then(setRecords)
  }, [appState.totalPoints, redeemRecords.length])

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const key = date.toLocaleDateString('sv-SE')
    const record = records.find(item => item.date === key)
    return {
      date: key,
      label: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      points: record?.pointsEarned ?? 0,
      done: record?.completedTasks.length ?? 0,
    }
  })

  const maxPoints = Math.max(...last7Days.map(item => item.points), 1)
  const thisMonth = new Date().toLocaleDateString('sv-SE').slice(0, 7)
  const monthRecords = records.filter(record => record.date.startsWith(thisMonth))
  const monthTotal = monthRecords.reduce((sum, record) => sum + record.pointsEarned, 0)
  const monthBonus = monthRecords.reduce((sum, record) => sum + record.bonusPoints, 0)
  const monthCompletedTasks = monthRecords.reduce((sum, record) => sum + record.completedTasks.length, 0)
  const totalCompletedTasks = records.reduce((sum, record) => sum + record.completedTasks.length, 0)

  const taskCompletion = useMemo(
    () =>
      tasks
        .map(task => ({
          id: task.id,
          title: task.title,
          icon: task.icon,
          count: records.reduce((sum, record) => sum + (record.completedTasks.includes(task.id) ? 1 : 0), 0),
          points: Math.max(0, task.points),
        }))
        .sort((a, b) => b.count - a.count || b.points - a.points),
    [records, tasks],
  )

  const unlockedAchievements = ACHIEVEMENTS.filter(achievement => {
    if (achievement.condition === 'first_task') return records.some(record => record.completedTasks.length > 0)
    if (achievement.condition === 'streak_3') return appState.streak >= 3
    if (achievement.condition === 'streak_7') return appState.streak >= 7
    if (achievement.condition === 'points_100') return appState.totalPoints >= 100
    if (achievement.condition === 'points_500') return appState.totalPoints >= 500
    if (achievement.condition === 'redeem_1') return redeemRecords.length >= 1
    return false
  })

  const completionRate = records.length === 0 ? 0 : Math.min(100, Math.round((totalCompletedTasks / Math.max(1, records.length * 4)) * 100))

  const handleReset = async () => {
    if (resetType === 'points') await resetPoints()
    else await resetAll()
    setShowReset(false)
  }

  const handleExportBackup = async () => {
    try {
      setIsBackupBusy(true)
      const backup = await exportBackup()
      const fileName = `kids-points-backup-${backup.exportedAt.replace(/[:.]/g, '-').replace('T', '_')}.json`
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)
      setBackupStatus(`备份已导出：${fileName}`)
    } catch (error) {
      setBackupStatus(error instanceof Error ? error.message : '导出备份失败')
    } finally {
      setIsBackupBusy(false)
    }
  }

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setIsBackupBusy(true)
      const text = await file.text()
      await importBackup(JSON.parse(text) as BackupData)
      setBackupStatus(`备份已恢复：${file.name}`)
    } catch (error) {
      setBackupStatus(error instanceof Error ? error.message : '恢复备份失败')
    } finally {
      event.target.value = ''
      setIsBackupBusy(false)
    }
  }

  return (
    <div className="relative z-10 space-y-4 px-4">
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-black text-white">📊 本月总结</span>
          <span className="text-xs text-gray-500">{thisMonth}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            { label: '获得积分', value: monthTotal, icon: '⚡', color: theme.accent },
            { label: '活跃天数', value: monthRecords.length, icon: '📅', color: theme.primary },
            { label: '完成任务', value: monthCompletedTasks, icon: '✅', color: '#34d399' },
            { label: '兑换次数', value: redeemRecords.filter(record => record.date.startsWith(thisMonth)).length, icon: '🎁', color: theme.secondary },
            { label: '连击加成', value: monthBonus, icon: '🔥', color: '#c084fc' },
          ].map(item => (
            <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: `${item.color}11`, border: `1px solid ${item.color}33` }}>
              <div className="text-2xl">{item.icon}</div>
              <div className="text-xl font-black" style={{ color: item.color }}>{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="flex items-center gap-3 rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.06), rgba(255,45,120,0.04))', border: '1px solid rgba(0,255,255,0.2)' }}
      >
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full" style={{ border: '2px solid #00ffff', boxShadow: '0 0 12px #00ffff44' }}>
          <img src={`${import.meta.env.BASE_URL}piggy.png`} alt="猪猪侠" className="h-full w-full object-cover object-top" style={{ transform: 'scale(1.1) translateY(5%)' }} />
        </div>
        <div>
          <div className="cyber-title text-sm font-black" style={{ color: '#00ffff' }}>猪猪侠建议</div>
          <div className="mt-0.5 text-sm text-gray-300">
            {monthCompletedTasks > 0
              ? `这个月已经完成 ${monthCompletedTasks} 个任务，继续保持现在的节奏，把连续打卡拉长。`
              : PIGGY_QUOTES.encourage}
          </div>
        </div>
      </motion.div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="mb-4 font-black text-white">📈 最近 7 天积分走势</div>
        <div className="flex h-24 items-end justify-between gap-2">
          {last7Days.map((day, index) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="text-xs font-bold" style={{ color: theme.primary }}>{day.points > 0 ? day.points : ''}</div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.points / maxPoints) * 80}px` }}
                transition={{ delay: index * 0.05, duration: 0.6, ease: 'easeOut' }}
                className="min-h-[4px] w-full rounded-t-lg"
                style={{ background: day.points > 0 ? `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})` : 'rgba(255,255,255,0.08)' }}
              />
              <div className="text-xs text-gray-500">周{day.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="mb-3 font-black text-white">完成最多的任务</div>
          <div className="space-y-3">
            {taskCompletion.slice(0, 5).map(task => (
              <div key={task.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-white/84">{task.icon} {task.title}</span>
                  <span className="text-gray-400">{task.count} 次</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, task.count * 20)}%`, background: `linear-gradient(90deg, ${theme.primary}, #ffffff)` }} />
                </div>
              </div>
            ))}
            {taskCompletion.length === 0 && <div className="text-sm text-gray-500">还没有任务记录。</div>}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="mb-3 font-black text-white">积分节奏</div>
          <div className="space-y-3">
            {[
              { label: '当前等级', value: `Lv.${appState.level}`, percent: Math.min(100, appState.level * 10), color: theme.accent },
              { label: '连续天数', value: `${appState.streak} 天`, percent: Math.min(100, appState.streak * 12), color: theme.secondary },
              { label: '任务完成率', value: `${completionRate}%`, percent: completionRate, color: theme.primary },
            ].map(item => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-white/84">{item.label}</span>
                  <span className="text-gray-400">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${item.percent}%`, background: `linear-gradient(90deg, ${item.color}, #ffffff)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="mb-3 font-black text-white">🏆 成就徽章 ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</div>
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
          {ACHIEVEMENTS.map(achievement => {
            const unlocked = unlockedAchievements.some(item => item.id === achievement.id)
            return (
              <div
                key={achievement.id}
                className="flex flex-col items-center gap-1 rounded-xl p-2"
                style={{
                  background: unlocked ? `${theme.accent}11` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${unlocked ? `${theme.accent}44` : 'rgba(255,255,255,0.06)'}`,
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <div className="text-2xl">{unlocked ? achievement.icon : '🔒'}</div>
                <div className="text-center text-xs font-bold leading-tight" style={{ color: unlocked ? theme.accent : '#555' }}>
                  {achievement.title}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.12)' }}>
        <div className="mb-3 flex items-center gap-2 font-black text-white">
          <span>{PIGGY_STICKERS.think}</span> 备份与恢复
        </div>
        <div className="mb-3 text-sm text-gray-400">导出当前浏览器内的完整积分数据，必要时可以重新导入恢复。</div>
        <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleExportBackup} disabled={isBackupBusy} className="w-full rounded-xl border border-cyan-400/30 bg-cyan-400/10 py-2.5 text-sm font-bold text-cyan-300 disabled:opacity-50">
            {isBackupBusy ? '处理中...' : '⬇️ 导出本地备份'}
          </button>
          <button onClick={() => importInputRef.current?.click()} disabled={isBackupBusy} className="w-full rounded-xl border border-amber-400/30 bg-amber-400/10 py-2.5 text-sm font-bold text-amber-300 disabled:opacity-50">
            {isBackupBusy ? '处理中...' : '⬆️ 导入恢复备份'}
          </button>
        </div>
        {backupStatus && <div className="mt-3 text-xs font-bold" style={{ color: '#00ffff' }}>{backupStatus}</div>}
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.15)' }}>
        <div className="mb-3 flex items-center gap-2 font-black text-white">
          <span>{PIGGY_STICKERS.shocked}</span> 重置设置
        </div>
        <div className="space-y-2">
          <button onClick={() => { setResetType('points'); setShowReset(true) }} className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-bold text-red-400">
            🔄 重置积分（保留历史记录）
          </button>
          <button onClick={() => { setResetType('all'); setShowReset(true) }} className="w-full rounded-xl border border-red-600/30 bg-red-600/10 py-2.5 text-sm font-bold text-red-500">
            ⚠️ 清空当前数据
          </button>
        </div>
      </div>

      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-6 w-full max-w-sm rounded-2xl p-6 text-center"
            style={{ background: '#1a0a3e', border: '1px solid rgba(255,80,80,0.4)' }}
          >
            <div className="mb-3 text-5xl">{PIGGY_STICKERS.shocked}</div>
            <div className="mb-2 text-lg font-black text-white">{resetType === 'points' ? '确定要重置积分吗？' : '确定清空当前数据吗？'}</div>
            <div className="mb-5 text-sm text-gray-400">{resetType === 'points' ? '积分将归零，历史记录保留' : '任务、奖励、历史记录将重置为默认状态'}</div>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)} className="flex-1 rounded-xl bg-white/5 py-3 font-black text-gray-400">取消</button>
              <button onClick={handleReset} className="flex-1 rounded-xl bg-red-600 py-3 font-black text-white">确认</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
