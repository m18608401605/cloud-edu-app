import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import type { Task, TaskCategory } from '../types'

const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string; icon: string }> = {
  study:  { label: '学习', color: '#00ffff', icon: '📚' },
  sport:  { label: '运动', color: '#00ff88', icon: '💪' },
  fun:    { label: '娱乐', color: '#ff2d78', icon: '🎨' },
  extra:  { label: '拓展', color: '#FFD700', icon: '🌟' },
  custom: { label: '自定义', color: '#b44fff', icon: '✨' },
}

type ViewMode = 'today' | 'all'

export function TaskList() {
  const { tasks, todayPlan, todayRecord, completeTask, uncompleteTask, addTask, removeTask, updateTask, addToTodayPlan, removeFromTodayPlan, reorderTasks, appState } = useStore()

  const [viewMode, setViewMode] = useState<ViewMode>('today')
  const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({ title: '', icon: '⭐', points: 10, category: 'custom' as TaskCategory, description: '', deadline: '', isDeduct: false })
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState(false)
  const dragFromRef = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const completed = new Set(todayRecord?.completedTasks ?? [])
  const completedAt = todayRecord?.completedAt ?? {}
  const todayTaskIds = new Set(todayPlan?.taskIds ?? [])

  // 按 taskOrder 排序
  const sortedTasks = (() => {
    const order = appState.taskOrder
    if (!order || order.length === 0) return tasks
    const map = new Map(tasks.map(t => [t.id, t]))
    const sorted = order.map(id => map.get(id)).filter(Boolean) as Task[]
    const rest = tasks.filter(t => !order.includes(t.id))
    return [...sorted, ...rest]
  })()

  const displayTasks = viewMode === 'today'
    ? sortedTasks.filter(t => todayTaskIds.has(t.id))
    : sortedTasks

  const filtered = activeCategory === 'all'
    ? displayTasks
    : displayTasks.filter(t => t.category === activeCategory)

  // 排序模式下用全部任务（不过滤分类）
  const sortableTasks = sortedTasks

  const todayDone = displayTasks.filter(t => completed.has(t.id)).length

  const handleComplete = async (task: Task) => {
    if (completingId) return
    setCompletingId(task.id)
    if (completed.has(task.id)) {
      await uncompleteTask(task.id)
    } else {
      await completeTask(task.id)
    }
    setTimeout(() => setCompletingId(null), 600)
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return
    const pts = newTask.isDeduct ? -Math.abs(newTask.points) : Math.abs(newTask.points)
    if (editingTask) {
      await updateTask({ ...editingTask, ...newTask, points: pts })
      setEditingTask(null)
    } else {
      const task: Task = { ...newTask, points: pts, id: `custom-${Date.now()}`, isCustom: true }
      await addTask(task)
    }
    setNewTask({ title: '', icon: '⭐', points: 10, category: 'custom', description: '', deadline: '', isDeduct: false })
    setShowAdd(false)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    const isDeduct = task.points < 0
    setNewTask({ title: task.title, icon: task.icon, points: Math.abs(task.points), category: task.category, description: task.description ?? '', deadline: task.deadline ?? '', isDeduct })
    setShowAdd(true)
  }

  const openAdd = () => {
    setEditingTask(null)
    setNewTask({ title: '', icon: '⭐', points: 10, category: 'custom', description: '', deadline: '', isDeduct: false })
    setShowAdd(true)
  }

  return (
    <div className="relative z-10 px-4">

      {/* 今日进度 + 安排今天 */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 p-3 rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.06), rgba(255,45,120,0.03))', border: '1px solid rgba(0,255,255,0.15)' }}>
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

      {/* 视图切换 + 排序按钮 */}
      <div className="flex gap-2 mb-3">
        {(['today', 'all'] as ViewMode[]).map(mode => (
          <motion.button key={mode} whileTap={{ scale: 0.92 }}
            onClick={() => { setViewMode(mode); setSortMode(false) }}
            className="flex-1 py-2 rounded-lg cyber-title text-sm"
            style={{
              background: !sortMode && viewMode === mode ? 'rgba(0,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${!sortMode && viewMode === mode ? 'rgba(0,255,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: !sortMode && viewMode === mode ? '#00ffff' : '#555',
              boxShadow: !sortMode && viewMode === mode ? '0 0 10px rgba(0,255,255,0.2)' : 'none',
            }}>
            {mode === 'today' ? '⚡ 今日任务' : '📚 任务库'}
          </motion.button>
        ))}
        <motion.button whileTap={{ scale: 0.92 }}
          onClick={() => setSortMode(s => !s)}
          className="px-3 py-2 rounded-lg cyber-title text-sm flex-shrink-0"
          style={{
            background: sortMode ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${sortMode ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: sortMode ? '#FFD700' : '#555',
          }}>
          ⇅ 排序
        </motion.button>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
        {(['all', 'study', 'sport', 'fun', 'extra', 'custom'] as (TaskCategory | 'all')[]).map(cat => {
          const cfg = cat === 'all' ? { label: '全部', color: '#00ffff', icon: '⚡' } : CATEGORY_CONFIG[cat]
          const isActive = activeCategory === cat
          return (
            <motion.button key={cat} whileTap={{ scale: 0.88 }}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold cyber-title"
              style={{
                background: isActive ? `${cfg.color}18` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? cfg.color : 'rgba(255,255,255,0.07)'}`,
                color: isActive ? cfg.color : '#555',
                boxShadow: isActive ? `0 0 8px ${cfg.color}33` : 'none',
                fontSize: 12,
              }}>
              <span>{cfg.icon}</span><span>{cfg.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* 排序模式 */}
      <AnimatePresence>
        {sortMode && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-3 rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,215,0,0.2)' }}>
            <div className="px-4 py-2 cyber-title text-xs" style={{ background: 'rgba(255,215,0,0.06)', color: '#FFD70099' }}>
              ⇅ 拖动 ≡ 或点击 ↑↓ 调整顺序
            </div>
            {sortableTasks.map((task, i) => {
              const cfg = CATEGORY_CONFIG[task.category]
              return (
                <div key={task.id}
                  draggable
                  onDragStart={() => { dragFromRef.current = i }}
                  onDragOver={e => { e.preventDefault(); setDragOverIndex(i) }}
                  onDrop={() => {
                    if (dragFromRef.current !== null && dragFromRef.current !== i) {
                      reorderTasks(dragFromRef.current, i)
                    }
                    dragFromRef.current = null; setDragOverIndex(null)
                  }}
                  onDragEnd={() => { dragFromRef.current = null; setDragOverIndex(null) }}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{
                    borderBottom: i < sortableTasks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: dragOverIndex === i ? 'rgba(255,215,0,0.08)' : 'transparent',
                    cursor: 'grab',
                  }}>
                  {/* 拖拽把手 */}
                  <span className="text-gray-600 select-none flex-shrink-0" style={{ fontSize: 18, cursor: 'grab' }}>≡</span>
                  <span className="text-xl flex-shrink-0">{task.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate" style={{ color: '#ddd' }}>{task.title}</div>
                    <span className="cyber-title px-1.5 py-0.5 rounded inline-block" style={{ background: cfg.color + '18', color: cfg.color, fontSize: 10 }}>{cfg.label}</span>
                  </div>
                  <span className="cyber-title font-black text-sm flex-shrink-0" style={{ color: task.points < 0 ? '#ff2d78' : '#FFD700' }}>
                    {task.points > 0 ? '+' : ''}{task.points}⚡
                  </span>
                  {/* 上下箭头 */}
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button disabled={i === 0}
                      onClick={() => reorderTasks(i, i - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-xs transition-colors"
                      style={{ background: i === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,215,0,0.1)', color: i === 0 ? '#333' : '#FFD700' }}>
                      ▲
                    </button>
                    <button disabled={i === sortableTasks.length - 1}
                      onClick={() => reorderTasks(i, i + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-xs transition-colors"
                      style={{ background: i === sortableTasks.length - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,215,0,0.1)', color: i === sortableTasks.length - 1 ? '#333' : '#FFD700' }}>
                      ▼
                    </button>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 任务列表 — 列表式 */}
      <div className="mb-3" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        {/* 表头 */}
        <div className="flex items-center px-4 py-2.5 cyber-title"
          style={{ background: 'rgba(0,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#00ffff88' }}>
          <span style={{ width: 72 }}>时间</span>
          <span className="flex-1">任务名称</span>
          <span style={{ width: 120 }}>描述</span>
          <span style={{ width: 60, textAlign: 'right' }}>积分</span>
          <span style={{ width: 36, textAlign: 'center' }}>完成</span>
        </div>

        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-10 text-gray-600 cyber-title" style={{ fontSize: 13 }}>
              {viewMode === 'today' ? '今天还没安排任务，点「安排今天」添加' : '还没有任务，点下方添加'}
            </motion.div>
          )}

          {filtered.map((task, i) => {
            const isDone = completed.has(task.id)
            const cfg = CATEGORY_CONFIG[task.category]
            const isCompleting = completingId === task.id
            const doneTime = completedAt[task.id]
            const inTodayPlan = todayTaskIds.has(task.id)

            return (
              <motion.div key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: i * 0.03 }}
                className="relative"
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: isDone
                    ? `linear-gradient(90deg, ${cfg.color}10, transparent)`
                    : 'transparent',
                }}>

                {/* 左侧彩色指示条 */}
                <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                  style={{ background: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }} />

                {/* 扫光动画 */}
                {isCompleting && (
                  <motion.div
                    initial={{ x: '-100%' }} animate={{ x: '200%' }} transition={{ duration: 0.5 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}30, transparent)` }}
                  />
                )}

                {/* 主行：点击完成 */}
                <div className="flex items-center px-4 py-3 pl-5 cursor-pointer gap-3"
                  onClick={() => handleComplete(task)}>

                  {/* 时间列 */}
                  <div style={{ width: 72, flexShrink: 0 }}>
                    {doneTime ? (
                      <span className="text-xs font-bold" style={{ color: '#00ff88', fontSize: 12 }}>✓ {doneTime}</span>
                    ) : task.deadline ? (
                      <span className="text-xs" style={{ color: isDone ? '#555' : '#ff2d78', fontSize: 12 }}>⏰ {task.deadline}</span>
                    ) : (
                      <span className="text-xs text-gray-700" style={{ fontSize: 12 }}>—</span>
                    )}
                  </div>

                  {/* 任务名称列 */}
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="text-xl flex-shrink-0">{task.icon}</span>
                    <div className="min-w-0">
                      <div className={`font-black text-base leading-tight ${isDone ? 'line-through opacity-50' : ''}`}
                        style={{ color: isDone ? cfg.color : '#e8e8e8' }}>
                        {task.title}
                      </div>
                      <span className="cyber-title px-1.5 py-0.5 rounded inline-block mt-0.5"
                        style={{ background: cfg.color + '18', color: cfg.color, fontSize: 10 }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* 描述列 */}
                  <div style={{ width: 120, flexShrink: 0 }}>
                    <span className="text-xs text-gray-500 leading-tight line-clamp-2" style={{ fontSize: 12 }}>
                      {task.description || '—'}
                    </span>
                  </div>

                  {/* 积分列 */}
                  <div style={{ width: 60, flexShrink: 0, textAlign: 'right' }}>
                    <span className="cyber-title font-black text-sm"
                      style={{
                        color: task.points < 0 ? '#ff2d78' : (isDone ? '#FFD700' : cfg.color),
                        textShadow: isDone ? (task.points < 0 ? '0 0 6px #ff2d78' : '0 0 6px #FFD700') : 'none',
                      }}>
                      {task.points > 0 ? '+' : ''}{task.points}⚡
                    </span>
                  </div>

                  {/* 完成勾 */}
                  <div style={{ width: 36, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                      animate={isDone ? { scale: [1, 1.3, 1] } : {}}
                      className="w-6 h-6 rounded-md border-2 flex items-center justify-center"
                      style={{
                        borderColor: isDone ? cfg.color : 'rgba(255,255,255,0.18)',
                        background: isDone ? cfg.color : 'transparent',
                        boxShadow: isDone ? `0 0 8px ${cfg.color}` : 'none',
                      }}>
                      {isDone && <span className="text-black font-black" style={{ fontSize: 11 }}>✓</span>}
                    </motion.div>
                  </div>
                </div>

                {/* 操作按钮行 */}
                <div className="flex gap-1.5 px-5 pb-2.5" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEdit(task)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg cyber-title"
                    style={{ background: 'rgba(0,255,255,0.08)', color: '#00ffff', fontSize: 11 }}>
                    ✏️ 编辑
                  </button>
                  {viewMode === 'all' && (
                    <button onClick={() => inTodayPlan ? removeFromTodayPlan(task.id) : addToTodayPlan(task.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg cyber-title"
                      style={{
                        background: inTodayPlan ? 'rgba(0,255,136,0.1)' : 'rgba(255,215,0,0.08)',
                        color: inTodayPlan ? '#00ff88' : '#FFD700',
                        fontSize: 11,
                      }}>
                      {inTodayPlan ? '✓ 已在今天' : '+ 加入今天'}
                    </button>
                  )}
                  {task.isCustom && (
                    <button onClick={() => removeTask(task.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg ml-auto"
                      style={{ background: 'rgba(255,45,120,0.1)', color: '#ff2d78', fontSize: 11 }}>
                      🗑 删除
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 添加按钮 */}
      <motion.button whileTap={{ scale: 0.95 }} onClick={openAdd}
        className="w-full py-3 rounded-xl cyber-title mb-2 text-sm"
        style={{ background: 'rgba(0,255,255,0.04)', border: '1px dashed rgba(0,255,255,0.2)', color: '#00ffff88' }}>
        ＋ ADD MISSION
      </motion.button>

      {/* 今日计划弹窗 — 居中 */}
      <AnimatePresence>
        {showPlanModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setShowPlanModal(false)}>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg rounded-2xl p-5"
              style={{
                background: 'linear-gradient(160deg, #0d0030, #020010)',
                border: '1px solid rgba(255,215,0,0.3)',
                boxShadow: '0 0 40px rgba(255,215,0,0.08)',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}>

              <div className="cyber-title text-center text-yellow-400 text-base mb-1">
                📋 安排今天的任务
              </div>
              <div className="text-gray-500 text-center mb-4" style={{ fontSize: 12 }}>
                选择今天要完成哪些任务
              </div>

              <div className="space-y-2">
                {tasks.map(task => {
                  const inPlan = todayTaskIds.has(task.id)
                  const cfg = CATEGORY_CONFIG[task.category]
                  return (
                    <motion.div key={task.id} whileTap={{ scale: 0.98 }}
                      onClick={() => inPlan ? removeFromTodayPlan(task.id) : addToTodayPlan(task.id)}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                      style={{
                        background: inPlan ? `${cfg.color}12` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${inPlan ? cfg.color + '44' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                      <span className="text-2xl">{task.icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">{task.title}</div>
                        <div className="cyber-title" style={{ color: cfg.color, fontSize: 11 }}>
                          {cfg.label} · +{task.points}⚡
                          {task.deadline && <span className="ml-2 text-pink-400">⏰{task.deadline}</span>}
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: inPlan ? cfg.color : 'rgba(255,255,255,0.15)',
                          background: inPlan ? cfg.color : 'transparent',
                        }}>
                        {inPlan && <span className="text-black font-black" style={{ fontSize: 11 }}>✓</span>}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <button onClick={() => setShowPlanModal(false)}
                className="w-full mt-4 py-3 rounded-xl font-black cyber-title text-sm"
                style={{ background: 'linear-gradient(135deg, #00ffff, #0066ff)', color: '#000' }}>
                确认 ({todayTaskIds.size} 个任务)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 添加/编辑任务弹窗 — 居中 */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg rounded-2xl p-6"
              style={{
                background: 'linear-gradient(160deg, #0d0030, #020010)',
                border: '1px solid rgba(0,255,255,0.3)',
                boxShadow: '0 0 40px rgba(0,255,255,0.1)',
              }}>

              <div className="cyber-title text-center text-cyan-400 text-base mb-5">
                {editingTask ? '✏️ EDIT MISSION' : '＋ NEW MISSION'}
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={newTask.icon} onChange={e => setNewTask(s => ({ ...s, icon: e.target.value }))}
                    className="w-14 text-center text-2xl rounded-lg p-2 border text-white"
                    style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.2)' }} maxLength={2} />
                  <input value={newTask.title} onChange={e => setNewTask(s => ({ ...s, title: e.target.value }))}
                    placeholder="任务名称"
                    className="flex-1 rounded-lg px-4 py-2 border font-bold placeholder-gray-600 text-white text-base"
                    style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.2)' }} />
                </div>

                <div className="flex gap-2">
                  <select value={newTask.category} onChange={e => setNewTask(s => ({ ...s, category: e.target.value as TaskCategory }))}
                    className="flex-1 rounded-lg px-3 py-2.5 border font-bold text-white text-sm"
                    style={{ background: '#080020', borderColor: 'rgba(0,255,255,0.2)' }}>
                    {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map(c => (
                      <option key={c} value={c} style={{ background: '#080020' }}>{CATEGORY_CONFIG[c].icon} {CATEGORY_CONFIG[c].label}</option>
                    ))}
                  </select>
                  {/* 加分/扣分切换 + 积分数值 */}
                  <div className="flex items-center rounded-lg border overflow-hidden"
                    style={{ borderColor: newTask.isDeduct ? 'rgba(255,45,120,0.4)' : 'rgba(255,215,0,0.3)' }}>
                    <button
                      onClick={() => setNewTask(s => ({ ...s, isDeduct: !s.isDeduct }))}
                      className="px-2.5 py-2 font-black text-sm transition-colors"
                      style={{
                        background: newTask.isDeduct ? 'rgba(255,45,120,0.15)' : 'rgba(255,215,0,0.08)',
                        color: newTask.isDeduct ? '#ff2d78' : '#FFD700',
                        minWidth: 36,
                      }}>
                      {newTask.isDeduct ? '−' : '+'}
                    </button>
                    <div className="flex items-center gap-1 px-2 py-2"
                      style={{ background: newTask.isDeduct ? 'rgba(255,45,120,0.05)' : 'rgba(255,215,0,0.05)' }}>
                      <span style={{ color: newTask.isDeduct ? '#ff2d78' : '#FFD700', fontSize: 14 }}>⚡</span>
                      <input type="number" value={newTask.points} onChange={e => setNewTask(s => ({ ...s, points: +e.target.value }))}
                        className="w-14 bg-transparent font-black text-center text-base"
                        style={{ color: newTask.isDeduct ? '#ff2d78' : '#FFD700' }} min={1} max={200} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 border"
                  style={{ background: 'rgba(255,45,120,0.05)', borderColor: 'rgba(255,45,120,0.2)' }}>
                  <span className="text-pink-400 text-base">⏰</span>
                  <span className="text-gray-400 text-sm">截止时间</span>
                  <input type="time" value={newTask.deadline} onChange={e => setNewTask(s => ({ ...s, deadline: e.target.value }))}
                    className="flex-1 bg-transparent text-white font-bold text-right text-sm"
                    style={{ colorScheme: 'dark' }} />
                </div>

                <input value={newTask.description} onChange={e => setNewTask(s => ({ ...s, description: e.target.value }))}
                  placeholder="任务描述（选填）"
                  className="w-full rounded-lg px-4 py-2.5 border placeholder-gray-600 text-white text-sm"
                  style={{ background: 'rgba(0,255,255,0.05)', borderColor: 'rgba(0,255,255,0.1)' }} />

                <div className="flex gap-3 mt-2">
                  <button onClick={() => { setShowAdd(false); setEditingTask(null) }}
                    className="flex-1 py-3 rounded-xl font-black text-gray-400 cyber-title text-sm"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    取消
                  </button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddTask}
                    className="flex-1 py-3 rounded-xl font-black text-black cyber-title text-sm"
                    style={{ background: 'linear-gradient(135deg, #00ffff, #00aaff)', boxShadow: '0 0 20px #00ffff44' }}>
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
