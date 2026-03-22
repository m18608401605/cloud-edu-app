import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthScreen } from './components/AuthScreen'
import { Header } from './components/Header'
import { MotivationPopup } from './components/MotivationPopup'
import { ProfileCenter } from './components/ProfileCenter'
import { RewardShop } from './components/RewardShop'
import { StarBackground } from './components/StarBackground'
import { StatsPage } from './components/StatsPage'
import { TaskList } from './components/TaskList'
import { ThemeShop } from './components/ThemeShop'
import { VoiceLab } from './components/VoiceLab'
import { DEFAULT_UI_SETTINGS, useStore } from './store/useStore'

type Tab = 'tasks' | 'shop' | 'stats' | 'profiles' | 'voice' | 'theme'

const TABS: { id: Tab; label: string; icon: string; auth?: boolean }[] = [
  { id: 'tasks', label: '任务', icon: '⚡' },
  { id: 'shop', label: '兑换', icon: '🎁' },
  { id: 'stats', label: '成长', icon: '📊' },
  { id: 'profiles', label: '档案', icon: '👨‍👩‍👧', auth: true },
  { id: 'voice', label: '语音', icon: '🎙️', auth: true },
  { id: 'theme', label: '主题', icon: '🎨' },
]

export default function App() {
  const { init, isLoading, appState, setCustomBg, currentUser } = useStore()
  const [tab, setTab] = useState<Tab>('tasks')
  const [showAuthScreen, setShowAuthScreen] = useState(false)
  const bgInputRef = useRef<HTMLInputElement>(null)
  const piggySrc = `${import.meta.env.BASE_URL}piggy.png`

  useEffect(() => { init() }, [init])

  const ui = { ...DEFAULT_UI_SETTINGS, ...appState.uiSettings }

  useEffect(() => {
    const merged = { ...DEFAULT_UI_SETTINGS, ...appState.uiSettings }
    const root = document.documentElement
    root.style.setProperty('--sidebar-width', `${merged.sidebarWidth}px`)
    root.style.setProperty('--content-max-width', `${merged.contentMaxWidth}px`)
    root.style.setProperty('--card-radius', `${merged.cardRadius}px`)
    root.style.setProperty('--bg-opacity', `${merged.bgOpacity / 100}`)
    root.style.setProperty('--text-brightness', `${merged.textBrightness}%`)
    document.body.style.fontSize = `${merged.fontSize}px`
    document.body.style.filter = `brightness(${merged.brightness}%)`
  }, [appState.uiSettings])

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = event => setCustomBg(event.target?.result as string)
    reader.readAsDataURL(file)
  }

  const openTab = (nextTab: Tab) => {
    const target = TABS.find(item => item.id === nextTab)
    if (target?.auth && !currentUser) {
      setShowAuthScreen(true)
      return
    }
    setTab(nextTab)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center hex-bg"
        style={{ background: 'linear-gradient(135deg, #020010, #0a0028, #020010)' }}>
        <motion.div
          animate={{ y: [0, -20, 0], filter: ['drop-shadow(0 0 10px #00ffff)', 'drop-shadow(0 0 30px #00ffff)', 'drop-shadow(0 0 10px #00ffff)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-28 h-28 rounded-full overflow-hidden mb-6"
          style={{ border: '2px solid #00ffff', boxShadow: '0 0 30px #00ffff66' }}>
          <img src={piggySrc} alt="猪猪侠" className="w-full h-full object-cover object-top scale-110" />
        </motion.div>
        <div className="cyber-title text-xl mb-4 neon-text-cyan">SYSTEM LOADING...</div>
      </div>
    )
  }

  if (showAuthScreen && !currentUser) {
    return <AuthScreen onContinueGuest={() => setShowAuthScreen(false)} />
  }

  const isLight = appState.colorMode === 'light'
  const bgStyle = appState.customBg
    ? { backgroundImage: `url(${appState.customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : isLight
    ? { background: 'linear-gradient(160deg, #ffffff 0%, #f0f4ff 50%, #faf5ff 100%)' }
    : { background: 'linear-gradient(135deg, #020010 0%, #080020 50%, #020015 100%)' }

  const renderContent = () => {
    if (tab === 'tasks') return <TaskList />
    if (tab === 'shop') return <RewardShop />
    if (tab === 'stats') return <StatsPage />
    if (tab === 'profiles') return <ProfileCenter />
    if (tab === 'voice') return <VoiceLab />
    return <ThemeShop />
  }

  return (
    <div className="min-h-screen relative hex-bg" style={bgStyle}>
      {appState.customBg && <div className="fixed inset-0 pointer-events-none" style={{ background: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(2,0,16,0.75)', zIndex: 0 }} />}
      {!isLight && <div className="scanline" />}
      <StarBackground isLight={isLight} starBrightness={ui.starBrightness} />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-8" style={{ background: isLight ? 'radial-gradient(circle, #a5c8ff, transparent)' : 'radial-gradient(circle, #00ffff, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8" style={{ background: isLight ? 'radial-gradient(circle, #c9b3ff, transparent)' : 'radial-gradient(circle, #ff2d78, transparent)', filter: 'blur(80px)' }} />
      </div>

      <div className="hidden lg:flex relative z-10 h-screen">
        <div className="flex flex-col h-screen sticky top-0"
          style={{
            width: 'var(--sidebar-width, 288px)',
            borderRight: isLight ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(0,255,255,0.1)',
            background: isLight ? `rgba(255,255,255,var(--bg-opacity, 0.6))` : `rgba(2,0,16,var(--bg-opacity, 0.6))`,
            backdropFilter: 'blur(20px)',
          }}>
          <div className="flex-1 overflow-y-auto">
            <Header />
            <div className="px-4 space-y-2 mt-2">
              {TABS.map(item => {
                const isActive = tab === item.id
                return (
                  <motion.button key={item.id} whileTap={{ scale: 0.96 }} onClick={() => openTab(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl relative overflow-hidden"
                    style={{
                      background: isActive ? (isLight ? 'rgba(99,102,241,0.1)' : 'rgba(0,255,255,0.1)') : (isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'),
                      border: isActive ? (isLight ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(0,255,255,0.35)') : (isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)'),
                    }}>
                    {isActive && <motion.div layoutId="sidebarIndicator" className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: isLight ? 'linear-gradient(180deg, #6366f1, #a855f7)' : 'linear-gradient(180deg, #00ffff, #ff2d78)' }} />}
                    <span className="text-2xl">{item.icon}</span>
                    <span className="cyber-title font-black" style={{ color: isActive ? (isLight ? '#6366f1' : '#00ffff') : isLight ? '#999' : '#444', fontSize: 12 }}>
                      {item.label} {item.auth && !currentUser ? '🔒' : ''}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <div className="px-4 mt-4">
              <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => bgInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl cyber-title flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,215,0,0.06)', border: '1px dashed rgba(255,215,0,0.25)', color: '#FFD70066', fontSize: 10 }}>
                🖼 自定义背景图片
              </motion.button>
              {!currentUser && (
                <button onClick={() => setShowAuthScreen(true)} className="w-full mt-2 py-2.5 rounded-xl cyber-title"
                  style={{ background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)', color: '#00ffffaa', fontSize: 10 }}>
                  🔐 登录解锁档案与语音分析
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto py-6" style={{ maxWidth: 'var(--content-max-width, 780px)' }}>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }} transition={{ duration: 0.2 }}>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="lg:hidden relative z-10 max-w-lg mx-auto pb-28">
        <Header />
        <div className="px-4 mb-2 flex gap-2">
          <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => bgInputRef.current?.click()}
            className="flex-1 py-2 rounded-xl cyber-title flex items-center justify-center gap-1.5"
            style={{ background: 'rgba(255,215,0,0.06)', border: '1px dashed rgba(255,215,0,0.2)', color: '#FFD70055', fontSize: 10 }}>
            🖼 自定义背景
          </motion.button>
          {!currentUser && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAuthScreen(true)}
              className="py-2 px-3 rounded-xl cyber-title"
              style={{ background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.15)', color: '#00ffffaa', fontSize: 10 }}>
              登录
            </motion.button>
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }} transition={{ duration: 0.25 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20"
        style={{
          background: isLight ? `rgba(255,255,255,calc(0.7 + var(--bg-opacity, 0.6) * 0.3))` : `rgba(2,0,16,calc(0.7 + var(--bg-opacity, 0.6) * 0.3))`,
          backdropFilter: 'blur(20px)',
          borderTop: isLight ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(0,255,255,0.12)',
        }}>
        <div className="max-w-lg mx-auto flex overflow-x-auto">
          {TABS.map(item => {
            const isActive = tab === item.id
            return (
              <motion.button key={item.id} whileTap={{ scale: 0.85 }} onClick={() => openTab(item.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 relative overflow-hidden min-w-[64px]">
                {isActive && <motion.div layoutId="tabBar" className="absolute top-0 left-3 right-3 h-0.5 rounded-full" style={{ background: isLight ? 'linear-gradient(90deg, #6366f1, #a855f7)' : 'linear-gradient(90deg, #00ffff, #ff2d78)' }} />}
                <span className="text-2xl relative z-10">{item.icon}</span>
                <span className="text-xs font-black relative z-10 cyber-title" style={{ color: isActive ? (isLight ? '#6366f1' : '#00ffff') : '#666', fontSize: 9 }}>
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <MotivationPopup />
    </div>
  )
}
