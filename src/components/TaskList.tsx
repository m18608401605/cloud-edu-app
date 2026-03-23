import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import type { Task, TaskCategory } from '../types'

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
  isDeduct: false,
}

export function TaskList() {
  const {
    tasks,
    todayPlan,
    todayRecord,
    completeTask,
    uncompleteTask,
    addTask,
    removeTask,
    updateTask,
    addToTodayPlan,
    removeFromTodayPlan,
    reorderTasks,
    appState,
  } = useStore()
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
      isDeduct: task.points < 0,
    })
    setShowAdd(true)
  }

  return (
    <div className="relative z-10 px-4">
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex-1 rounded-xl p-3"
          style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.06), rgba(255,45,120,0.03))', border: '1px solid rgba(0,255,255,0.15)' }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="cyber-title text-xs text-cyan-400 opacity-70">TODAY'S MISSION</span>
            <span className="cyber-title text-sm font-black" style={{ color: todayDone === displayTasks.length && displayTasks.length > 0 ? '#00ff88' : '#FFD700' }}>
              {todayDone} / {displayTasks.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(0,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: displayTasks.length > 0 ? `${(todayDone / displayTasks.length) * 100}%` : '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ background: 'linear-gradient(90deg, #00ffff, #00ff88)', boxShadow: '0 0 6px #00ffff' }}
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPlanModal(true)}
          className="cyber-title flex min-w-[64px] flex-col items-center rounded-xl px-3 py-2 text-center"
          style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}
        >
          <span className="text-xl">📋</span>
          <span style={{ fontSize: 11 }}>安排今天</span>
        </motion.button>
      </div>

      <div className="mb-3 flex gap-2">
        {(['today', 'all'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className="cyber-title flex-1 rounded-lg py-2 text-sm"
            style={{
              background: viewMode === mode ? 'rgba(0,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${viewMode === mode ? 'rgba(0,255,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: viewMode === mode ? '#00ffff' : '#555',
            }}
          >
            {mode === 'today' ? '⚡ 今日任务' : '📚 任务库'}
          </button>
        ))}
      </div>

      <div className="mb-3 overflow-hidden rounded-[14px]" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <div
          className="cyber-title flex items-center px-4 py-2.5"
          style={{ background: 'rgba(0,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#00ffff88' }}
        >
          <span style={{ width: 72 }}>时间</span>
          <span className="flex-1">任务名称</span>
          <span style={{ width: 130 }}>类型</span>
          <span style={{ width: 60, textAlign: 'right' }}>积分</span>
          <span style={{ width: 36, textAlign: 'center' }}>完成</span>
        </div>

        <AnimatePresence>
          {displayTasks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-title py-10 text-center text-gray-600" style={{ fontSize: 13 }}>
              {viewMode === 'today' ? '今天还没安排任务，点「安排今天」添加' : '还没有任务，点下方添加'}
            </motion.div>
          )}

          {displayTasks.map(task => {
            const isDone = completed.has(task.id)
            const cfg = CATEGORY_CONFIG[task.category]
            const inTodayPlan = todayTaskIds.has(task.id)

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isDone ? `linear-gradient(90deg, ${cfg.color}10, transparent)` : 'transparent' }}
              >
                <div className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }} />
                <div className="flex cursor-pointer items-center gap-3 px-4 py-3 pl-5" onClick={() => handleComplete(task)}>
                  <div style={{ width: 72, flexShrink: 0 }}>
                    {completedAt[task.id] ? (
                      <span className="text-xs font-bold" style={{ color: '#00ff88', fontSize: 12 }}>✓ {completedAt[task.id]}</span>
                    ) : task.deadline ? (
                      <span className="text-xs" style={{ color: '#ff2d78', fontSize: 12 }}>⏰ {task.deadline}</span>
                    ) : (
                      <span className="text-xs text-gray-700">—</span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="flex-shrink-0 text-xl">{task.icon}</span>
                    <div className="min-w-0">
                      <div className={`text-base font-black leading-tight ${isDone ? 'line-through opacity-50' : ''}`} style={{ color: isDone ? cfg.color : '#e8e8e8' }}>
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500">{task.description || '—'}</div>
                    </div>
                  </div>
                  <div style={{ width: 130, flexShrink: 0 }}>
                    <div className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.icon} {cfg.label}</div>
                    <div className="text-xs text-gray-500">{task.points >= 0 ? '完成可得积分' : '完成会扣积分'}</div>
                  </div>
                  <div style={{ width: 60, flexShrink: 0, textAlign: 'right' }}>
                    <span className="cyber-title text-sm font-black" style={{ color: task.points < 0 ? '#ff2d78' : isDone ? '#FFD700' : cfg.color }}>
                      {task.points > 0 ? '+' : ''}{task.points}⚡
                    </span>
                  </div>
                  <div style={{ width: 36, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-md border-2"
                      style={{ borderColor: isDone ? cfg.color : 'rgba(255,255,255,0.18)', background: isDone ? cfg.color : 'transparent' }}
                    >
                      {isDone && <span className="text-black font-black" style={{ fontSize: 11 }}>✓</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1.5 px-5 pb-2.5">
                  <button onClick={() => openEdit(task)} className="cyber-title rounded-lg px-2.5 py-1" style={{ background: 'rgba(0,255,255,0.08)', color: '#00ffff', fontSize: 11 }}>✏️ 编辑</button>
                  {viewMode === 'all' && (
                    <button
                      onClick={() => (inTodayPlan ? removeFromTodayPlan(task.id) : addToTodayPlan(task.id))}
                      className="cyber-title rounded-lg px-2.5 py-1"
                      style={{ background: inTodayPlan ? 'rgba(0,255,136,0.1)' : 'rgba(255,215,0,0.08)', color: inTodayPlan ? '#00ff88' : '#FFD700', fontSize: 11 }}
                    >
                      {inTodayPlan ? '✓ 已在今天' : '+ 加入今天'}
                    </button>
                  )}
                  <button onClick={() => reorderTasks(Math.max(0, order.indexOf(task.id)), Math.max(0, order.indexOf(task.id) - 1))} className="rounded-lg bg-amber-400/10 px-2 py-1 text-xs font-black text-amber-300">↑</button>
                  <button onClick={() => reorderTasks(order.indexOf(task.id), Math.min(order.length - 1, order.indexOf(task.id) + 1))} className="rounded-lg bg-amber-400/10 px-2 py-1 text-xs font-black text-amber-300">↓</button>
                  {task.isCustom && <button onClick={() => removeTask(task.id)} className="ml-auto rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-black text-rose-300">🗑 删除</button>}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setEditingTask(null)
          setNewTask(EMPTY_FORM)
          setShowAdd(true)
        }}
        className="cyber-title mb-2 w-full rounded-xl py-3 text-sm"
        style={{ background: 'rgba(0,255,255,0.04)', border: '1px dashed rgba(0,255,255,0.2)', color: '#00ffff88' }}
      >
        ＋ ADD MISSION
      </motion.button>

      <AnimatePresence>
        {showPlanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={event => event.target === event.currentTarget && setShowPlanModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-5"
              style={{ background: 'linear-gradient(160deg, #0d0030, #020010)', border: '1px solid rgba(255,215,0,0.3)', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <div className="cyber-title mb-4 text-center text-base text-yellow-400">📋 安排今天的任务</div>
              <div className="space-y-2">
                {orderedTasks.map(task => {
                  const inPlan = todayTaskIds.has(task.id)
                  const cfg = CATEGORY_CONFIG[task.category]
                  return (
                    <div
                      key={task.id}
                      onClick={() => (inPlan ? removeFromTodayPlan(task.id) : addToTodayPlan(task.id))}
                      className="flex cursor-pointer items-center gap-3 rounded-xl p-3"
                      style={{ background: inPlan ? 'rgba(0,255,255,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${inPlan ? 'rgba(0,255,255,0.35)' : 'rgba(255,255,255,0.08)'}` }}
                    >
                      <span className="text-2xl">{task.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">{task.title}</div>
                        <div className="text-xs" style={{ color: cfg.color }}>{cfg.icon} {cfg.label} · {task.points > 0 ? '+' : ''}{task.points}⚡</div>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-md border-2" style={{ borderColor: inPlan ? '#00ffff' : 'rgba(255,255,255,0.15)', background: inPlan ? '#00ffff' : 'transparent' }}>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={event => event.target === event.currentTarget && setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: 'linear-gradient(160deg, #0d0030, #020010)', border: '1px solid rgba(0,255,255,0.3)' }}
            >
              <div className="cyber-title mb-5 text-center text-base text-cyan-400">{editingTask ? '✏️ EDIT MISSION' : '＋ NEW MISSION'}</div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={newTask.icon} onChange={event => setNewTask(state => ({ ...state, icon: event.target.value }))} className="w-14 rounded-lg border p-2 text-center text-2xl text-white" style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.2)' }} maxLength={2} />
                  <input value={newTask.title} onChange={event => setNewTask(state => ({ ...state, title: event.target.value }))} placeholder="任务名称" className="flex-1 rounded-lg border px-4 py-2 text-base font-bold text-white placeholder-gray-600" style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.2)' }} />
                </div>
                <div className="flex gap-2">
                  <select value={newTask.category} onChange={event => setNewTask(state => ({ ...state, category: event.target.value as TaskCategory }))} className="flex-1 rounded-lg border px-3 py-2.5 text-sm font-bold text-white" style={{ background: '#080020', borderColor: 'rgba(0,255,255,0.2)' }}>
                    {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map(category => (
                      <option key={category} value={category}>{CATEGORY_CONFIG[category].icon} {CATEGORY_CONFIG[category].label}</option>
                    ))}
                  </select>
                  <div className="flex items-center overflow-hidden rounded-lg border" style={{ borderColor: newTask.isDeduct ? 'rgba(255,45,120,0.4)' : 'rgba(255,215,0,0.3)' }}>
                    <button onClick={() => setNewTask(state => ({ ...state, isDeduct: !state.isDeduct }))} className="px-2.5 py-2 text-sm font-black" style={{ background: newTask.isDeduct ? 'rgba(255,45,120,0.15)' : 'rgba(255,215,0,0.08)', color: newTask.isDeduct ? '#ff2d78' : '#FFD700' }}>
                      {newTask.isDeduct ? '−' : '+'}
                    </button>
                    <input type="number" value={newTask.points} onChange={event => setNewTask(state => ({ ...state, points: +event.target.value }))} className="w-16 bg-transparent px-2 py-2 text-center font-black" style={{ color: newTask.isDeduct ? '#ff2d78' : '#FFD700' }} min={1} max={200} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="time" value={newTask.deadline} onChange={event => setNewTask(state => ({ ...state, deadline: event.target.value }))} className="rounded-lg border px-3 py-2.5 text-sm text-white" style={{ background: '#080020', borderColor: 'rgba(255,45,120,0.3)', colorScheme: 'dark' }} />
                  <div className="flex items-center rounded-lg border px-3 py-2.5 text-sm font-bold" style={{ background: 'rgba(0,255,255,0.04)', borderColor: 'rgba(0,255,255,0.16)', color: '#00ffff' }}>
                    {CATEGORY_CONFIG[newTask.category].icon} {CATEGORY_CONFIG[newTask.category].label}
                  </div>
                </div>
                <input value={newTask.description} onChange={event => setNewTask(state => ({ ...state, description: event.target.value }))} placeholder="任务描述（选填）" className="w-full rounded-lg border px-4 py-2.5 text-sm text-white placeholder-gray-600" style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.1)' }} />
                <div className="mt-2 flex gap-3">
                  <button onClick={() => { setShowAdd(false); setEditingTask(null) }} className="cyber-title flex-1 rounded-xl py-3 text-sm text-gray-400" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>取消</button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className="cyber-title flex-1 rounded-xl py-3 text-sm font-black text-black" style={{ background: 'linear-gradient(135deg, #00ffff, #00aaff)', boxShadow: '0 0 20px #00ffff44' }}>
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
