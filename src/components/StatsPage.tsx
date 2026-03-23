import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ACHIEVEMENTS, CAPABILITIES, getCapabilityMeta, getSubjectMeta, SUBJECTS, THEMES } from '../data'
import { getAllDailyRecords } from '../db'
import { useStore } from '../store/useStore'
import type { BackupData, DailyRecord } from '../types'
import { PIGGY_STICKERS, PIGGY_QUOTES } from '../data/piggyStickers'

export function StatsPage() {
  const {
    appState,
    redeemRecords,
    resetPoints,
    resetAll,
    exportBackup,
    importBackup,
    tasks,
    currentUser,
    childProfiles,
    activeProfileId,
    voiceSessions,
  } = useStore()
  const theme = THEMES.find(item => item.id === appState.currentTheme) ?? THEMES[0]
  const [records, setRecords] = useState<DailyRecord[]>([])
  const [showReset, setShowReset] = useState(false)
  const [resetType, setResetType] = useState<'points' | 'all'>('points')
  const [backupStatus, setBackupStatus] = useState('')
  const [isBackupBusy, setIsBackupBusy] = useState(false)
  const importInputRef = useRef<HTMLInputElement>(null)
  const activeProfile = childProfiles.find(profile => profile.id === activeProfileId)

  useEffect(() => { getAllDailyRecords().then(setRecords) }, [appState.totalPoints, redeemRecords.length, activeProfileId])

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const key = date.toLocaleDateString('sv-SE')
    const record = records.find(item => item.date === key)
    return { date: key, label: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()], points: record?.pointsEarned ?? 0, done: record?.completedTasks.length ?? 0 }
  })

  const maxPoints = Math.max(...last7Days.map(item => item.points), 1)
  const thisMonth = new Date().toLocaleDateString('sv-SE').slice(0, 7)
  const monthRecords = records.filter(record => record.date.startsWith(thisMonth))
  const monthTotal = monthRecords.reduce((sum, record) => sum + record.pointsEarned, 0)

  const subjectScores = useMemo(() => SUBJECTS.map(subject => {
    const subjectTasks = tasks.filter(task => task.subjectId === subject.id)
    const totalCompleted = records.reduce((sum, record) => sum + record.completedTasks.filter(taskId => subjectTasks.some(task => task.id === taskId)).length, 0)
    const totalPoints = subjectTasks.reduce((sum, task) => sum + Math.max(0, task.points), 0)
    return {
      ...subject,
      completed: totalCompleted,
      value: Math.min(100, totalCompleted * 8 + totalPoints),
    }
  }).sort((a, b) => b.value - a.value), [records, tasks])

  const capabilityScores = useMemo(() => CAPABILITIES.map(capability => {
    const capabilityTasks = tasks.filter(task => (task.capabilityIds ?? []).includes(capability.id))
    const completed = records.reduce((sum, record) => sum + record.completedTasks.filter(taskId => capabilityTasks.some(task => task.id === taskId)).length, 0)
    const voiceBonus = voiceSessions.filter(session => session.capabilityId === capability.id).reduce((sum, session) => sum + session.score, 0)
    return {
      ...capability,
      value: Math.min(100, completed * 8 + Math.round(voiceBonus / Math.max(1, voiceSessions.length || 1))),
    }
  }).sort((a, b) => b.value - a.value), [records, tasks, voiceSessions])

  const voiceSummary = useMemo(() => {
    if (voiceSessions.length === 0) return null
    const total = voiceSessions.reduce((sum, session) => sum + session.score, 0)
    const latest = voiceSessions[0]
    return {
      avg: Math.round(total / voiceSessions.length),
      latestSubject: getSubjectMeta(latest.subjectId).label,
      latestCapability: getCapabilityMeta(latest.capabilityId).label,
    }
  }, [voiceSessions])

  const unlockedAchievements = ACHIEVEMENTS.filter(achievement => {
    if (achievement.condition === 'first_task') return records.some(record => record.completedTasks.length > 0)
    if (achievement.condition === 'streak_3') return appState.streak >= 3
    if (achievement.condition === 'streak_7') return appState.streak >= 7
    if (achievement.condition === 'points_100') return appState.totalPoints >= 100
    if (achievement.condition === 'points_500') return appState.totalPoints >= 500
    if (achievement.condition === 'redeem_1') return redeemRecords.length >= 1
    return false
  })

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
    <div className="relative z-10 px-4 space-y-4">
      {currentUser && activeProfile ? (
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.08), rgba(250,204,21,0.08))', border: '1px solid rgba(0,255,255,0.15)' }}>
          <div className="text-white font-black text-lg">{activeProfile.avatarEmoji} {activeProfile.name} 的综合成长画像</div>
          <div className="text-gray-400 text-sm mt-1">{activeProfile.grade} · 目标：{activeProfile.target || '持续成长'} · 家长账号：{currentUser.name}</div>
        </div>
      ) : (
        <div className="rounded-2xl p-4 text-sm text-gray-400" style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.18)' }}>
          当前是游客模式。登录后可将成长数据绑定到孩子档案，并解锁语音分析与档案级综合分析。
        </div>
      )}

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-black">📊 本月总结</span>
          <span className="text-gray-500 text-xs">{thisMonth}</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '获得积分', value: monthTotal, icon: '⚡', color: theme.accent },
            { label: '活跃天数', value: monthRecords.length, icon: '📅', color: theme.primary },
            { label: '兑换次数', value: redeemRecords.filter(record => record.date.startsWith(thisMonth)).length, icon: '🎁', color: theme.secondary },
            { label: '语音记录', value: voiceSessions.length, icon: '🎙️', color: '#34d399' },
          ].map(item => (
            <div key={item.label} className="text-center rounded-xl p-3" style={{ background: `${item.color}11`, border: `1px solid ${item.color}33` }}>
              <div className="text-2xl">{item.icon}</div>
              <div className="font-black text-xl" style={{ color: item.color }}>{item.value}</div>
              <div className="text-gray-500 text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.06), rgba(255,45,120,0.04))', border: '1px solid rgba(0,255,255,0.2)' }}>
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
          style={{ border: '2px solid #00ffff', boxShadow: '0 0 12px #00ffff44' }}>
          <img src={`${import.meta.env.BASE_URL}piggy.png`} alt="猪猪侠" className="w-full h-full object-cover object-top" style={{ transform: 'scale(1.1) translateY(5%)' }} />
        </div>
        <div>
          <div className="font-black text-sm cyber-title" style={{ color: '#00ffff' }}>猪猪侠建议</div>
          <div className="text-gray-300 text-sm mt-0.5">
            {voiceSummary
              ? `最近语音训练平均 ${voiceSummary.avg} 分，重点继续强化 ${voiceSummary.latestSubject} 的 ${voiceSummary.latestCapability}。`
              : PIGGY_QUOTES.encourage}
          </div>
        </div>
      </motion.div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-white font-black mb-4">📈 最近 7 天积分走势</div>
        <div className="flex items-end justify-between gap-2 h-24">
          {last7Days.map((day, index) => (
            <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-xs font-bold" style={{ color: theme.primary }}>{day.points > 0 ? day.points : ''}</div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.points / maxPoints) * 80}px` }}
                transition={{ delay: index * 0.05, duration: 0.6, ease: 'easeOut' }}
                className="w-full rounded-t-lg min-h-[4px]"
                style={{ background: day.points > 0 ? `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})` : 'rgba(255,255,255,0.08)' }}
              />
              <div className="text-gray-500 text-xs">周{day.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-white font-black mb-3">学科成长分析</div>
          <div className="space-y-3">
            {subjectScores.slice(0, 5).map(subject => (
              <div key={subject.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: subject.color }}>{subject.icon} {subject.label}</span>
                  <span className="text-gray-400">{subject.value} 分</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${subject.value}%`, background: `linear-gradient(90deg, ${subject.color}, #ffffff)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-white font-black mb-3">能力成长分析</div>
          <div className="space-y-3">
            {capabilityScores.slice(0, 5).map(capability => (
              <div key={capability.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: capability.color }}>{capability.icon} {capability.label}</span>
                  <span className="text-gray-400">{capability.value} 分</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${capability.value}%`, background: `linear-gradient(90deg, ${capability.color}, #ffffff)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-white font-black mb-3">🏆 成就徽章 ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          {ACHIEVEMENTS.map(achievement => {
            const unlocked = unlockedAchievements.some(item => item.id === achievement.id)
            return (
              <div key={achievement.id} className="flex flex-col items-center gap-1 p-2 rounded-xl"
                style={{ background: unlocked ? `${theme.accent}11` : 'rgba(255,255,255,0.04)', border: `1px solid ${unlocked ? theme.accent + '44' : 'rgba(255,255,255,0.06)'}`, opacity: unlocked ? 1 : 0.4 }}>
                <div className="text-2xl">{unlocked ? achievement.icon : '🔒'}</div>
                <div className="text-xs text-center font-bold leading-tight" style={{ color: unlocked ? theme.accent : '#555' }}>{achievement.title}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.12)' }}>
        <div className="text-white font-black mb-3 flex items-center gap-2">
          <span>{PIGGY_STICKERS.think}</span> 备份与恢复
        </div>
        <div className="text-gray-400 text-sm mb-3">导出当前浏览器内的完整积分与成长数据，必要时可以重新导入恢复。</div>
        <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleExportBackup} disabled={isBackupBusy} className="w-full py-2.5 rounded-xl font-bold text-sm text-cyan-300 border border-cyan-400/30 bg-cyan-400/10 disabled:opacity-50">
            {isBackupBusy ? '处理中...' : '⬇️ 导出本地备份'}
          </button>
          <button onClick={() => importInputRef.current?.click()} disabled={isBackupBusy} className="w-full py-2.5 rounded-xl font-bold text-sm text-amber-300 border border-amber-400/30 bg-amber-400/10 disabled:opacity-50">
            {isBackupBusy ? '处理中...' : '⬆️ 导入恢复备份'}
          </button>
        </div>
        {backupStatus && <div className="mt-3 text-xs font-bold" style={{ color: '#00ffff' }}>{backupStatus}</div>}
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.15)' }}>
        <div className="text-white font-black mb-3 flex items-center gap-2">
          <span>{PIGGY_STICKERS.shocked}</span> 重置设置
        </div>
        <div className="space-y-2">
          <button onClick={() => { setResetType('points'); setShowReset(true) }} className="w-full py-2.5 rounded-xl font-bold text-sm text-red-400 border border-red-500/30 bg-red-500/10">
            🔄 重置积分（保留历史记录）
          </button>
          <button onClick={() => { setResetType('all'); setShowReset(true) }} className="w-full py-2.5 rounded-xl font-bold text-sm text-red-500 border border-red-600/30 bg-red-600/10">
            ⚠️ 清空当前档案数据
          </button>
        </div>
      </div>

      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="mx-6 p-6 rounded-2xl text-center max-w-sm w-full"
            style={{ background: '#1a0a3e', border: '1px solid rgba(255,80,80,0.4)' }}>
            <div className="text-5xl mb-3">{PIGGY_STICKERS.shocked}</div>
            <div className="text-white font-black text-lg mb-2">{resetType === 'points' ? '确定要重置积分吗？' : '确定清空当前档案数据吗？'}</div>
            <div className="text-gray-400 text-sm mb-5">{resetType === 'points' ? '积分将归零，历史记录保留' : '任务、奖励、历史记录将重置为默认状态'}</div>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)} className="flex-1 py-3 rounded-xl font-black text-gray-400 bg-white/5">取消</button>
              <button onClick={handleReset} className="flex-1 py-3 rounded-xl font-black text-white bg-red-600">确认</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
