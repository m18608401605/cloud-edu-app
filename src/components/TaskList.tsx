import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CAPABILITIES, SUBJECTS } from '../data'
import { useStore } from '../store/useStore'
import type { CapabilityId, SubjectId, Task, TaskCategory } from '../types'

const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string; icon: string }> = {
  study: { label: '学习', color: '#00ffff', icon: '📚' },
  sport: { label: '运动', color: '#00ff88', icon: '💪' },
  fun: { label: '娱乐', color: '#ff2d78', icon: '🎨' },
  extra: { label: '拓展', color: '#FFD700', icon: '🌟' },
  custom: { label: '自定义', color: '#b44fff', icon: '✨' },
}

type ViewMode = 'today' | 'all'

const EMPTY_FORM = {
  title: '',
  icon: '⭐',
  points: 10,
  category: 'custom' as TaskCategory,
  description: '',
  deadline: '',
  subjectId: 'habit' as SubjectId,
  capabilityIds: ['discipline'] as CapabilityId[],
  isDeduct: false,
}

export function TaskList() {
  const { tasks, todayPlan, todayRecord, completeTask, uncompleteTask, addTask, removeTask, updateTask, addToTodayPlan, removeFromTodayPlan, reorderTasks, appState, currentUser } = useStore()
  const [viewMode, setViewMode] = useState<ViewMode>('today')
  const [showAdd, setShowAdd] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState(EMPTY_FORM)

  const completed = new Set(todayRecord?.completedTasks ?? [])
  const completedAt = todayRecord?.completedAt ?? {}
  const todayTaskIds = new Set(todayPlan?.taskIds ?? [])
  const order = appState.taskOrder ?? tasks.map(task => task.id)
  const orderedTasks = [...tasks].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  const displayTasks = viewMode === 'today' ? orderedTasks.filter(task => todayTaskIds.has(task.id)) : orderedTasks
  const todayDone = displayTasks.filter(task => completed.has(task.id)).length

  const toggleCapability = (capabilityId: CapabilityId) => {
    setNewTask(state => ({
      ...state,
      capabilityIds: state.capabilityIds.includes(capabilityId)
        ? state.capabilityIds.filter(item => item !== capabilityId)
        : [...state.capabilityIds, capabilityId],
    }))
  }

  const handleComplete = async (task: Task) => {
    if (completed.has(task.id)) await uncompleteTask(task.id)
    else await completeTask(task.id)
  }

  const handleSave = async () => {
    if (!newTask.title.trim()) return
    const points = newTask.isDeduct ? -Math.abs(newTask.points) : Math.abs(newTask.points)
    const payload: Task = {
      id: editingTask?.id ?? `custom-${Date.now()}`,
      title: newTask.title.trim(),
      icon: newTask.icon,
      points,
      category: newTask.category,
      description: newTask.description.trim(),
      deadline: newTask.deadline,
      subjectId: newTask.subjectId,
      capabilityIds: newTask.capabilityIds,
      isCustom: editingTask?.isCustom ?? true,
    }

    if (editingTask) await updateTask(payload)
    else await addTask(payload)
    setEditingTask(null)
    setNewTask(EMPTY_FORM)
    setShowAdd(false)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      icon: task.icon,
      points: Math.abs(task.points),
      category: task.category,
      description: task.description ?? '',
      deadline: task.deadline ?? '',
      subjectId: task.subjectId ?? 'habit',
      capabilityIds: task.capabilityIds ?? ['discipline'],
      isDeduct: task.points < 0,
    })
    setShowAdd(true)
  }

  const activeSubject = SUBJECTS.find(subject => subject.id === newTask.subjectId) ?? SUBJECTS[0]

  return (
    <div className="relative z-10 px-4">
      {!currentUser && (
        <div className="mb-4 rounded-2xl p-4" style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)' }}>
          <div className="font-black text-yellow-300">游客模式</div>
          <div className="text-sm text-gray-400 mt-1">当前积分体验仍可用；登录后会把任务和成长数据绑定到孩子档案，并开启语音分析和综合成长中心。</div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.06), rgba(255,45,120,0.03))', border: '1px solid rgba(0,255,255,0.15)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="cyber-title text-xs text-cyan-400 opacity-70">TODAY'S MISSION</span>
            <span className="cyber-title text-sm font-black" style={{ color: todayDone === displayTasks.length && displayTasks.length > 0 ? '#00ff88' : '#FFD700' }}>
              {todayDone} / {displayTasks.length}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: displayTasks.length > 0 ? `${(todayDone / displayTasks.length) * 100}%` : '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ background: 'linear-gradient(90deg, #00ffff, #00ff88)', boxShadow: '0 0 6px #00ffff' }}
            />
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowPlanModal(true)}
          className="flex flex-col items-center px-3 py-2 rounded-xl cyber-title text-center"
          style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', minWidth: 64 }}>
          <span className="text-xl">📋</span>
          <span style={{ fontSize: 11 }}>安排今天</span>
        </motion.button>
      </div>

      <div className="flex gap-2 mb-3">
        {(['today', 'all'] as ViewMode[]).map(mode => (
          <button key={mode} onClick={() => setViewMode(mode)}
            className="flex-1 py-2 rounded-lg cyber-title text-sm"
            style={{
              background: viewMode === mode ? 'rgba(0,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${viewMode === mode ? 'rgba(0,255,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: viewMode === mode ? '#00ffff' : '#555',
            }}>
            {mode === 'today' ? '⚡ 今日任务' : '📚 任务库'}
          </button>
        ))}
      </div>

      <div className="mb-3" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div className="flex items-center px-4 py-2.5 cyber-title"
          style={{ background: 'rgba(0,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#00ffff88' }}>
          <span style={{ width: 72 }}>时间</span>
          <span className="flex-1">任务名称</span>
          <span style={{ width: 130 }}>学科/能力</span>
          <span style={{ width: 60, textAlign: 'right' }}>积分</span>
          <span style={{ width: 36, textAlign: 'center' }}>完成</span>
        </div>

        <AnimatePresence>
          {displayTasks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-gray-600 cyber-title" style={{ fontSize: 13 }}>
              {viewMode === 'today' ? '今天还没安排任务，点「安排今天」添加' : '还没有任务，点下方添加'}
            </motion.div>
          )}

          {displayTasks.map(task => {
            const isDone = completed.has(task.id)
            const cfg = CATEGORY_CONFIG[task.category]
            const subject = SUBJECTS.find(item => item.id === task.subjectId)
            const capabilities = (task.capabilityIds ?? []).map(item => CAPABILITIES.find(capability => capability.id === item)?.label).filter(Boolean).slice(0, 2)
            const inTodayPlan = todayTaskIds.has(task.id)

            return (
              <motion.div key={task.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isDone ? `linear-gradient(90deg, ${cfg.color}10, transparent)` : 'transparent' }}>
                <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }} />
                <div className="flex items-center px-4 py-3 pl-5 cursor-pointer gap-3" onClick={() => handleComplete(task)}>
                  <div style={{ width: 72, flexShrink: 0 }}>
                    {completedAt[task.id]
                      ? <span className="text-xs font-bold" style={{ color: '#00ff88', fontSize: 12 }}>✓ {completedAt[task.id]}</span>
                      : task.deadline
                      ? <span className="text-xs" style={{ color: '#ff2d78', fontSize: 12 }}>⏰ {task.deadline}</span>
                      : <span className="text-xs text-gray-700">—</span>}
                  </div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="text-xl flex-shrink-0">{task.icon}</span>
                    <div className="min-w-0">
                      <div className={`font-black text-base leading-tight ${isDone ? 'line-through opacity-50' : ''}`} style={{ color: isDone ? cfg.color : '#e8e8e8' }}>{task.title}</div>
                      <div className="text-xs text-gray-500">{task.description || '—'}</div>
                    </div>
                  </div>
                  <div style={{ width: 130, flexShrink: 0 }}>
                    <div className="text-xs font-bold" style={{ color: subject?.color ?? '#aaa' }}>{subject?.icon} {subject?.label ?? '习惯'}</div>
                    <div className="text-xs text-gray-500">{capabilities.join(' · ') || '成长记录'}</div>
                  </div>
                  <div style={{ width: 60, flexShrink: 0, textAlign: 'right' }}>
                    <span className="cyber-title font-black text-sm" style={{ color: task.points < 0 ? '#ff2d78' : (isDone ? '#FFD700' : cfg.color) }}>
                      {task.points > 0 ? '+' : ''}{task.points}⚡
                    </span>
                  </div>
                  <div style={{ width: 36, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <div className="w-6 h-6 rounded-md border-2 flex items-center justify-center"
                      style={{ borderColor: isDone ? cfg.color : 'rgba(255,255,255,0.18)', background: isDone ? cfg.color : 'transparent' }}>
                      {isDone && <span className="text-black font-black" style={{ fontSize: 11 }}>✓</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1.5 px-5 pb-2.5">
                  <button onClick={() => openEdit(task)} className="px-2.5 py-1 rounded-lg cyber-title" style={{ background: 'rgba(0,255,255,0.08)', color: '#00ffff', fontSize: 11 }}>✏️ 编辑</button>
                  {viewMode === 'all' && (
                    <button onClick={() => inTodayPlan ? removeFromTodayPlan(task.id) : addToTodayPlan(task.id)}
                      className="px-2.5 py-1 rounded-lg cyber-title"
                      style={{ background: inTodayPlan ? 'rgba(0,255,136,0.1)' : 'rgba(255,215,0,0.08)', color: inTodayPlan ? '#00ff88' : '#FFD700', fontSize: 11 }}>
                      {inTodayPlan ? '✓ 已在今天' : '+ 加入今天'}
                    </button>
                  )}
                  <button onClick={() => reorderTasks(Math.max(0, order.indexOf(task.id)), Math.max(0, order.indexOf(task.id) - 1))}
                    className="px-2 py-1 rounded-lg text-xs font-black text-amber-300 bg-amber-400/10">↑</button>
                  <button onClick={() => reorderTasks(order.indexOf(task.id), Math.min(order.length - 1, order.indexOf(task.id) + 1))}
                    className="px-2 py-1 rounded-lg text-xs font-black text-amber-300 bg-amber-400/10">↓</button>
                  {task.isCustom && <button onClick={() => removeTask(task.id)} className="ml-auto px-2.5 py-1 rounded-lg text-xs font-black text-rose-300 bg-rose-500/10">🗑 删除</button>}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setEditingTask(null); setNewTask(EMPTY_FORM); setShowAdd(true) }}
        className="w-full py-3 rounded-xl cyber-title mb-2 text-sm"
        style={{ background: 'rgba(0,255,255,0.04)', border: '1px dashed rgba(0,255,255,0.2)', color: '#00ffff88' }}>
        ＋ ADD MISSION
      </motion.button>

      <AnimatePresence>
        {showPlanModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setShowPlanModal(false)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-5"
              style={{ background: 'linear-gradient(160deg, #0d0030, #020010)', border: '1px solid rgba(255,215,0,0.3)', maxHeight: '80vh', overflowY: 'auto' }}>
              <div className="cyber-title text-center text-yellow-400 text-base mb-4">📋 安排今天的任务</div>
              <div className="space-y-2">
                {orderedTasks.map(task => {
                  const inPlan = todayTaskIds.has(task.id)
                  const subject = SUBJECTS.find(item => item.id === task.subjectId)
                  return (
                    <div key={task.id} onClick={() => inPlan ? removeFromTodayPlan(task.id) : addToTodayPlan(task.id)}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                      style={{ background: inPlan ? 'rgba(0,255,255,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${inPlan ? 'rgba(0,255,255,0.35)' : 'rgba(255,255,255,0.08)'}` }}>
                      <span className="text-2xl">{task.icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">{task.title}</div>
                        <div className="text-xs" style={{ color: subject?.color ?? '#999' }}>{subject?.icon} {subject?.label ?? '习惯'} · {task.points > 0 ? '+' : ''}{task.points}⚡</div>
                      </div>
                      <div className="w-6 h-6 rounded-md border-2 flex items-center justify-center" style={{ borderColor: inPlan ? '#00ffff' : 'rgba(255,255,255,0.15)', background: inPlan ? '#00ffff' : 'transparent' }}>
                        {inPlan && <span className="text-black font-black" style={{ fontSize: 11 }}>✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: 'linear-gradient(160deg, #0d0030, #020010)', border: '1px solid rgba(0,255,255,0.3)' }}>
              <div className="cyber-title text-center text-cyan-400 text-base mb-5">{editingTask ? '✏️ EDIT MISSION' : '＋ NEW MISSION'}</div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={newTask.icon} onChange={e => setNewTask(s => ({ ...s, icon: e.target.value }))} className="w-14 text-center text-2xl rounded-lg p-2 border text-white" style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.2)' }} maxLength={2} />
                  <input value={newTask.title} onChange={e => setNewTask(s => ({ ...s, title: e.target.value }))} placeholder="任务名称" className="flex-1 rounded-lg px-4 py-2 border font-bold placeholder-gray-600 text-white text-base" style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.2)' }} />
                </div>
                <div className="flex gap-2">
                  <select value={newTask.category} onChange={e => setNewTask(s => ({ ...s, category: e.target.value as TaskCategory }))} className="flex-1 rounded-lg px-3 py-2.5 border font-bold text-white text-sm" style={{ background: '#080020', borderColor: 'rgba(0,255,255,0.2)' }}>
                    {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map(category => (
                      <option key={category} value={category}>{CATEGORY_CONFIG[category].icon} {CATEGORY_CONFIG[category].label}</option>
                    ))}
                  </select>
                  <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: newTask.isDeduct ? 'rgba(255,45,120,0.4)' : 'rgba(255,215,0,0.3)' }}>
                    <button onClick={() => setNewTask(s => ({ ...s, isDeduct: !s.isDeduct }))} className="px-2.5 py-2 font-black text-sm" style={{ background: newTask.isDeduct ? 'rgba(255,45,120,0.15)' : 'rgba(255,215,0,0.08)', color: newTask.isDeduct ? '#ff2d78' : '#FFD700' }}>
                      {newTask.isDeduct ? '−' : '+'}
                    </button>
                    <input type="number" value={newTask.points} onChange={e => setNewTask(s => ({ ...s, points: +e.target.value }))} className="w-16 px-2 py-2 bg-transparent text-center font-black" style={{ color: newTask.isDeduct ? '#ff2d78' : '#FFD700' }} min={1} max={200} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={newTask.subjectId} onChange={e => setNewTask(s => ({ ...s, subjectId: e.target.value as SubjectId }))} className="rounded-lg px-3 py-2.5 border text-white text-sm" style={{ background: '#080020', borderColor: `${activeSubject.color}55` }}>
                    {SUBJECTS.map(subject => <option key={subject.id} value={subject.id}>{subject.icon} {subject.label}</option>)}
                  </select>
                  <input type="time" value={newTask.deadline} onChange={e => setNewTask(s => ({ ...s, deadline: e.target.value }))} className="rounded-lg px-3 py-2.5 border text-white text-sm" style={{ background: '#080020', borderColor: 'rgba(255,45,120,0.3)', colorScheme: 'dark' }} />
                </div>
                <div>
                  <div className="text-sm font-black mb-2" style={{ color: activeSubject.color }}>{activeSubject.icon} 能力标签</div>
                  <div className="flex flex-wrap gap-2">
                    {CAPABILITIES.map(capability => (
                      <button key={capability.id} onClick={() => toggleCapability(capability.id)} className="px-3 py-1.5 rounded-full text-xs font-black"
                        style={{ background: newTask.capabilityIds.includes(capability.id) ? `${capability.color}22` : 'rgba(255,255,255,0.05)', color: newTask.capabilityIds.includes(capability.id) ? capability.color : '#94a3b8' }}>
                        {capability.icon} {capability.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input value={newTask.description} onChange={e => setNewTask(s => ({ ...s, description: e.target.value }))} placeholder="任务描述（选填）" className="w-full rounded-lg px-4 py-2.5 border placeholder-gray-600 text-white text-sm" style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.1)' }} />
                <div className="flex gap-3 mt-2">
                  <button onClick={() => { setShowAdd(false); setEditingTask(null) }} className="flex-1 py-3 rounded-xl font-black text-gray-400 cyber-title text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>取消</button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className="flex-1 py-3 rounded-xl font-black text-black cyber-title text-sm" style={{ background: 'linear-gradient(135deg, #00ffff, #00aaff)', boxShadow: '0 0 20px #00ffff44' }}>
                    {editingTask ? '保存 ✓' : '确认 ✓'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
