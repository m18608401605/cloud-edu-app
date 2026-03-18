import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import type { Task, TaskCategory } from '../types'
import { THEMES } from '../data'

const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string; icon: string }> = {
  study:  { label: '学习', color: '#00d4ff', icon: '📚' },
  sport:  { label: '运动', color: '#00ff88', icon: '💪' },
  fun:    { label: '娱乐', color: '#b44fff', icon: '🎨' },
  extra:  { label: '拓展', color: '#FFD700', icon: '🌟' },
  custom: { label: '自定义', color: '#ff6eb4', icon: '✨' },
}

export function TaskList() {
  const { tasks, todayRecord, appState, completeTask, uncompleteTask, addTask, removeTask } = useStore()
  const theme = THEMES.find(t => t.id === appState.currentTheme)!
  const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', icon: '⭐', points: 10, category: 'custom' as TaskCategory, description: '' })
  const [completingId, setCompletingId] = useState<string | null>(null)

  const completed = new Set(todayRecord?.completedTasks ?? [])
  const filtered = activeCategory === 'all' ? tasks : tasks.filter(t => t.category === activeCategory)
  const categories: (TaskCategory | 'all')[] = ['all', 'study', 'sport', 'fun', 'extra', 'custom']

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
    const task: Task = { ...newTask, id: `custom-${Date.now()}`, isCustom: true }
    await addTask(task)
    setNewTask({ title: '', icon: '⭐', points: 10, category: 'custom', description: '' })
    setShowAdd(false)
  }

  return (
    <div className="relative z-10 px-4">
      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {categories.map(cat => {
          const cfg = cat === 'all' ? { label: '全部', color: theme.primary, icon: '🏆' } : CATEGORY_CONFIG[cat]
          const isActive = activeCategory === cat
          return (
            <motion.button key={cat} whileTap={{ scale: 0.92 }}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all"
              style={{
                background: isActive ? `linear-gradient(135deg, ${cfg.color}33, ${cfg.color}22)` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isActive ? cfg.color : 'rgba(255,255,255,0.1)'}`,
                color: isActive ? cfg.color : '#888',
                boxShadow: isActive ? `0 0 10px ${cfg.color}44` : 'none',
              }}>
              <span>{cfg.icon}</span>
              <span>{cfg.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* 任务列表 */}
      <div className="space-y-3 mb-4">
        <AnimatePresence>
          {filtered.map(task => {
            const isDone = completed.has(task.id)
            const cfg = CATEGORY_CONFIG[task.category]
            const isCompleting = completingId === task.id

            return (
              <motion.div key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleComplete(task)}
                className="relative overflow-hidden cursor-pointer rounded-2xl p-4"
                style={{
                  background: isDone
                    ? `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}11)`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isDone ? cfg.color + '66' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isDone ? `0 0 15px ${cfg.color}22` : 'none',
                }}
              >
                {/* 完成时的扫光效果 */}
                {isCompleting && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                )}

                <div className="flex items-center gap-3">
                  {/* 图标 */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: isDone ? `linear-gradient(135deg, ${cfg.color}44, ${cfg.color}22)` : 'rgba(255,255,255,0.07)',
                      border: `1px solid ${cfg.color}44`,
                    }}>
                    {task.icon}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-base ${isDone ? 'line-through' : ''}`}
                        style={{ color: isDone ? cfg.color : '#fff' }}>
                        {task.title}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: cfg.color + '22', color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                    {task.description && (
                      <div className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</div>
                    )}
                  </div>

                  {/* 积分 + 完成状态 */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 font-black"
                      style={{ color: isDone ? '#FFD700' : cfg.color }}>
                      <span className="text-sm">⚡</span>
                      <span>+{task.points}</span>
                    </div>
                    <motion.div
                      animate={isDone ? { scale: [1, 1.3, 1] } : {}}
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: isDone ? cfg.color : 'rgba(255,255,255,0.2)',
                        background: isDone ? `linear-gradient(135deg, ${cfg.color}, ${cfg.color}aa)` : 'transparent',
                      }}>
                      {isDone && <span className="text-xs">✓</span>}
                    </motion.div>
                  </div>
                </div>

                {/* 删除按钮（自定义任务） */}
                {task.isCustom && (
                  <button
                    onClick={e => { e.stopPropagation(); removeTask(task.id) }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center hover:bg-red-500/40"
                  >×</button>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 添加任务按钮 */}
      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAdd(true)}
        className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', color: '#888' }}>
        <span className="text-lg">＋</span> 添加自定义任务
      </motion.button>

      {/* 添加任务弹窗 */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && setShowAdd(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg rounded-t-3xl p-6"
              style={{ background: 'linear-gradient(180deg, #1a0a3e, #0a0520)', border: '1px solid rgba(0,212,255,0.3)' }}
            >
              <div className="text-white font-black text-xl mb-4 text-center">✨ 添加新任务</div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={newTask.icon} onChange={e => setNewTask(s => ({ ...s, icon: e.target.value }))}
                    className="w-14 text-center text-2xl rounded-xl p-2 bg-white/10 text-white border border-white/20" maxLength={2} />
                  <input value={newTask.title} onChange={e => setNewTask(s => ({ ...s, title: e.target.value }))}
                    placeholder="任务名称"
                    className="flex-1 rounded-xl px-4 py-2 bg-white/10 text-white border border-white/20 font-bold placeholder-gray-500" />
                </div>

                <div className="flex gap-2">
                  <select value={newTask.category} onChange={e => setNewTask(s => ({ ...s, category: e.target.value as TaskCategory }))}
                    className="flex-1 rounded-xl px-3 py-2 bg-white/10 text-white border border-white/20 font-bold">
                    {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map(c => (
                      <option key={c} value={c} style={{ background: '#1a0a3e' }}>{CATEGORY_CONFIG[c].icon} {CATEGORY_CONFIG[c].label}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-white/10 border border-white/20">
                    <span className="text-yellow-400">⚡</span>
                    <input type="number" value={newTask.points} onChange={e => setNewTask(s => ({ ...s, points: +e.target.value }))}
                      className="w-16 bg-transparent text-white font-black text-center" min={1} max={50} />
                  </div>
                </div>

                <input value={newTask.description} onChange={e => setNewTask(s => ({ ...s, description: e.target.value }))}
                  placeholder="任务描述（选填）"
                  className="w-full rounded-xl px-4 py-2 bg-white/10 text-white border border-white/20 placeholder-gray-500" />

                <div className="flex gap-3">
                  <button onClick={() => setShowAdd(false)}
                    className="flex-1 py-3 rounded-xl font-black text-gray-400 bg-white/5 border border-white/10">取消</button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddTask}
                    className="flex-1 py-3 rounded-xl font-black text-black"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>确认添加 ✓</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
