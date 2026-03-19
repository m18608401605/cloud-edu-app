import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, DEFAULT_UI_SETTINGS } from './store/useStore'
import { StarBackground } from './components/StarBackground'
import { Header } from './components/Header'
import { TaskList } from './components/TaskList'
import { RewardShop } from './components/RewardShop'
import { StatsPage } from './components/StatsPage'
import { ThemeShop } from './components/ThemeShop'
import { MotivationPopup } from './components/MotivationPopup'

type Tab = 'tasks' | 'shop' | 'stats' | 'theme'
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'tasks', label: '任务', icon: '⚡' },
  { id: 'shop', label: '兑换', icon: '🎁' },
  { id: 'stats', label: '成长', icon: '📊' },
  { id: 'theme', label: '主题', icon: '🎨' },
]

export default function App() {
  const { init, isLoading, appState, setCustomBg } = useStore()
  const [tab, setTab] = useState<Tab>('tasks')
  const bgInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { init() }, [])

  // 合并 UI 设置（兼容旧数据）
  const ui = { ...DEFAULT_UI_SETTINGS, ...appState.uiSettings }

  // 注入 CSS 变量，驱动全局布局参数
  useEffect(() => {
    const u = { ...DEFAULT_UI_SETTINGS, ...appState.uiSettings }
    const root = document.documentElement
    root.style.setProperty('--sidebar-width', `${u.sidebarWidth}px`)
    root.style.setProperty('--content-max-width', `${u.contentMaxWidth}px`)
    root.style.setProperty('--card-radius', `${u.cardRadius}px`)
    root.style.setProperty('--bg-opacity', `${u.bgOpacity / 100}`)
    root.style.setProperty('--text-brightness', `${u.textBrightness}%`)
    document.body.style.fontSize = `${u.fontSize}px`
    document.body.style.filter = `brightness(${u.brightness}%)`
  }, [appState.uiSettings])

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const base64 = ev.target?.result as string
      setCustomBg(base64)
    }
    reader.readAsDataURL(file)
  }

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center hex-bg"
      style={{ background: 'linear-gradient(135deg, #020010, #0a0028, #020010)' }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #00ffff08 0%, transparent 70%)' }} />
      <motion.div
        animate={{ y: [0, -20, 0], filter: ['drop-shadow(0 0 10px #00ffff)', 'drop-shadow(0 0 30px #00ffff)', 'drop-shadow(0 0 10px #00ffff)'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative w-28 h-28 rounded-full overflow-hidden mb-6"
        style={{ border: '2px solid #00ffff', boxShadow: '0 0 30px #00ffff66' }}>
        <img src="/cloud-edu-app/kids-points/piggy.png" alt="猪猪侠" className="w-full h-full object-cover object-top scale-110" />
      </motion.div>
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
        className="cyber-title text-xl mb-4 neon-text-cyan">
        SYSTEM LOADING...
      </motion.div>
      <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,255,255,0.1)' }}>
        <motion.div className="h-full rounded-full"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'linear-gradient(90deg, #00ffff, #ff2d78)' }}
        />
      </div>
    </div>
  )

  const isLight = appState.colorMode === 'light'

  const bgStyle = appState.customBg
    ? { backgroundImage: `url(${appState.customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : isLight
    ? { background: 'linear-gradient(160deg, #ffffff 0%, #f0f4ff 50%, #faf5ff 100%)' }
    : { background: 'linear-gradient(135deg, #020010 0%, #080020 50%, #020015 100%)' }

  return (
    <div className="min-h-screen relative hex-bg" style={bgStyle}>
      {appState.customBg && (
        <div className="fixed inset-0 pointer-events-none" style={{ background: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(2,0,16,0.75)', zIndex: 0 }} />
      )}

      {!isLight && <div className="scanline" />}
      <StarBackground isLight={isLight} starBrightness={ui.starBrightness} />

      {/* 背景光晕 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-8"
          style={{ background: isLight ? 'radial-gradient(circle, #a5c8ff, transparent)' : 'radial-gradient(circle, #00ffff, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8"
          style={{ background: isLight ? 'radial-gradient(circle, #c9b3ff, transparent)' : 'radial-gradient(circle, #ff2d78, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute left-0 top-0 bottom-0 w-px"
          style={{ background: isLight ? 'linear-gradient(180deg, transparent, rgba(99,102,241,0.3), transparent)' : 'linear-gradient(180deg, transparent, #00ffff44, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-px"
          style={{ background: isLight ? 'linear-gradient(180deg, transparent, rgba(168,85,247,0.3), transparent)' : 'linear-gradient(180deg, transparent, #ff2d7844, transparent)' }} />
      </div>

      {/* ===== 电脑端双栏布局 ===== */}
      <div className="hidden lg:flex relative z-10 h-screen">

        {/* 左栏：Header + 导航 */}
        <div className="flex flex-col h-screen sticky top-0"
          style={{
            width: 'var(--sidebar-width, 288px)',
            borderRight: isLight ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(0,255,255,0.1)',
            background: isLight
              ? `rgba(255,255,255,var(--bg-opacity, 0.6))`
              : `rgba(2,0,16,var(--bg-opacity, 0.6))`,
            backdropFilter: 'blur(20px)',
          }}>
          <div className="flex-1 overflow-y-auto">
            <Header />

            {/* 左侧导航 */}
            <div className="px-4 space-y-2 mt-2">
              {TABS.map(t => {
                const isActive = tab === t.id
                return (
                  <motion.button key={t.id} whileTap={{ scale: 0.96 }}
                    onClick={() => setTab(t.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl relative overflow-hidden"
                    style={{
                      background: isActive
                        ? isLight ? 'rgba(99,102,241,0.1)' : 'rgba(0,255,255,0.1)'
                        : isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                      border: isActive
                        ? isLight ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(0,255,255,0.35)'
                        : isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive
                        ? isLight ? '0 0 15px rgba(99,102,241,0.15)' : '0 0 15px rgba(0,255,255,0.15)'
                        : 'none',
                    }}>
                    {isActive && (
                      <motion.div layoutId="sidebarIndicator"
                        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                        style={{ background: isLight ? 'linear-gradient(180deg, #6366f1, #a855f7)' : 'linear-gradient(180deg, #00ffff, #ff2d78)' }} />
                    )}
                    <span className="text-2xl">{t.icon}</span>
                    <span className="cyber-title font-black"
                      style={{
                        color: isActive ? (isLight ? '#6366f1' : '#00ffff') : isLight ? '#999' : '#444',
                        textShadow: isActive ? (isLight ? '0 0 8px #6366f1' : '0 0 8px #00ffff') : 'none',
                        fontSize: 12,
                      }}>
                      {t.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* 换背景按钮 */}
            <div className="px-4 mt-4">
              <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => bgInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl cyber-title flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,215,0,0.06)', border: '1px dashed rgba(255,215,0,0.25)', color: '#FFD70066', fontSize: 10 }}>
                🖼 自定义背景图片
              </motion.button>
              {appState.customBg && (
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCustomBg(undefined)}
                  className="w-full mt-2 py-1.5 rounded-xl cyber-title"
                  style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)', color: '#ff2d7866', fontSize: 10 }}>
                  ✕ 恢复默认背景
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* 右栏：内容区 */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto py-6" style={{ maxWidth: 'var(--content-max-width, 672px)' }}>
            <AnimatePresence mode="wait">
              <motion.div key={tab}
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                transition={{ duration: 0.2 }}>
                {tab === 'tasks' && <TaskList />}
                {tab === 'shop' && <RewardShop />}
                {tab === 'stats' && <StatsPage />}
                {tab === 'theme' && <ThemeShop />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ===== 手机端单栏布局 ===== */}
      <div className="lg:hidden relative z-10 max-w-lg mx-auto pb-28">
        <Header />

        {/* 手机端背景图上传按钮（放在 header 下方） */}
        <div className="px-4 mb-2 flex gap-2">
          <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
          <motion.button whileTap={{ scale: 0.95 }}
            onClick={() => bgInputRef.current?.click()}
            className="flex-1 py-2 rounded-xl cyber-title flex items-center justify-center gap-1.5"
            style={{ background: 'rgba(255,215,0,0.06)', border: '1px dashed rgba(255,215,0,0.2)', color: '#FFD70055', fontSize: 10 }}>
            🖼 自定义背景
          </motion.button>
          {appState.customBg && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCustomBg(undefined)}
              className="py-2 px-3 rounded-xl cyber-title"
              style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)', color: '#ff2d7855', fontSize: 10 }}>
              ✕
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{ duration: 0.25 }}>
            {tab === 'tasks' && <TaskList />}
            {tab === 'shop' && <RewardShop />}
            {tab === 'stats' && <StatsPage />}
            {tab === 'theme' && <ThemeShop />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 手机端底部导航 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20"
        style={{
          background: isLight
            ? `rgba(255,255,255,calc(0.7 + var(--bg-opacity, 0.6) * 0.3))`
            : `rgba(2,0,16,calc(0.7 + var(--bg-opacity, 0.6) * 0.3))`,
          backdropFilter: 'blur(20px)',
          borderTop: isLight ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(0,255,255,0.12)',
          boxShadow: isLight ? '0 -4px 30px rgba(99,102,241,0.08)' : '0 -4px 30px rgba(0,255,255,0.08)',
        }}>
        <div className="max-w-lg mx-auto flex">
          {TABS.map(t => {
            const isActive = tab === t.id
            return (
              <motion.button key={t.id} whileTap={{ scale: 0.85 }}
                onClick={() => setTab(t.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 relative overflow-hidden">
                {isActive && (
                  <motion.div layoutId="tabBar"
                    className="absolute top-0 left-3 right-3 h-0.5 rounded-full"
                    style={{
                      background: isLight ? 'linear-gradient(90deg, #6366f1, #a855f7)' : 'linear-gradient(90deg, #00ffff, #ff2d78)',
                      boxShadow: isLight ? '0 0 8px #6366f1' : '0 0 8px #00ffff',
                    }} />
                )}
                {isActive && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0"
                    style={{ background: isLight ? 'radial-gradient(ellipse at center top, rgba(99,102,241,0.08), transparent)' : 'radial-gradient(ellipse at center top, rgba(0,255,255,0.08), transparent)' }} />
                )}
                <motion.span animate={{ scale: isActive ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}
                  className="text-2xl relative z-10">{t.icon}</motion.span>
                <span className="text-xs font-black relative z-10 cyber-title"
                  style={{
                    color: isActive ? (isLight ? '#6366f1' : '#00ffff') : isLight ? '#aaa' : '#444',
                    textShadow: isActive ? (isLight ? '0 0 8px #6366f1' : '0 0 8px #00ffff') : 'none',
                    fontSize: 9,
                  }}>
                  {t.label}
                </span>
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
