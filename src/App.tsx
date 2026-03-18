import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from './store/useStore'
import { StarBackground } from './components/StarBackground'
import { Header } from './components/Header'
import { TaskList } from './components/TaskList'
import { RewardShop } from './components/RewardShop'
import { StatsPage } from './components/StatsPage'
import { ThemeShop } from './components/ThemeShop'
import { MotivationPopup } from './components/MotivationPopup'
import { THEMES } from './data'

type Tab = 'tasks' | 'shop' | 'stats' | 'theme'
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'tasks', label: '任务', icon: '⚡' },
  { id: 'shop', label: '兑换', icon: '🎁' },
  { id: 'stats', label: '成长', icon: '📊' },
  { id: 'theme', label: '主题', icon: '🎨' },
]

export default function App() {
  const { init, isLoading, appState } = useStore()
  const [tab, setTab] = useState<Tab>('tasks')
  const theme = THEMES.find(t => t.id === appState.currentTheme) ?? THEMES[0]

  useEffect(() => { init() }, [])

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0a0520, #1a0a3e)' }}>
      <motion.div animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }} className="text-7xl mb-4">🐷</motion.div>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
        className="font-black text-xl" style={{ color: '#00d4ff' }}>能量加载中...</motion.div>
      <div className="mt-4 flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-blue-400" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #0a0520 0%, #1a0a3e 50%, #0d1b4e 100%)' }}>
      <StarBackground />

      {/* 科技走廊光效 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-px opacity-40"
          style={{ background: `linear-gradient(180deg, transparent, ${theme.primary}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-px opacity-40"
          style={{ background: `linear-gradient(180deg, transparent, ${theme.primary}, transparent)` }} />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 max-w-lg mx-auto pb-28">
        <Header />
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {tab === 'tasks' && <TaskList />}
            {tab === 'shop' && <RewardShop />}
            {tab === 'stats' && <StatsPage />}
            {tab === 'theme' && <ThemeShop />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 z-20"
        style={{ background: 'rgba(10,5,32,0.92)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${theme.primary}22` }}>
        <div className="max-w-lg mx-auto flex">
          {TABS.map(t => {
            const isActive = tab === t.id
            return (
              <motion.button key={t.id} whileTap={{ scale: 0.88 }}
                onClick={() => setTab(t.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 relative">
                {isActive && (
                  <motion.div layoutId="tabBar"
                    className="absolute top-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }} />
                )}
                <span className="text-2xl">{t.icon}</span>
                <span className="text-xs font-black" style={{ color: isActive ? theme.primary : '#555' }}>{t.label}</span>
              </motion.button>
            )
          })}
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </div>

      <MotivationPopup />
    </div>
  )
}
