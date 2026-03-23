import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getNextLevelPoints, getStyleProfile, LEVEL_NAMES } from '../data'
import { useStore } from '../store/useStore'

export function Header() {
  const { appState, setCustomAvatar, childProfiles, activeProfileId } = useStore()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const piggySrc = `${import.meta.env.BASE_URL}piggy.png`
  const levelName = LEVEL_NAMES[appState.level - 1] ?? '传奇英雄'
  const nextLevelPts = getNextLevelPoints(appState.level)
  const prevLevelPts = getNextLevelPoints(appState.level - 1)
  const progress = Math.min(100, ((appState.totalPoints - prevLevelPts) / Math.max(1, nextLevelPts - prevLevelPts)) * 100)
  const activeProfile = childProfiles.find(profile => profile.id === activeProfileId)
  const styleProfile = getStyleProfile(appState.styleProfileId ?? 'kids')
  const avatarSrc = activeProfile?.customAvatar ?? appState.customAvatar ?? piggySrc

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = loadEvent => {
      const result = loadEvent.target?.result as string
      void setCustomAvatar(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="relative z-10 px-4 pt-6 pb-4">
      <div className="mb-4 flex items-center gap-3">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex-shrink-0 cursor-pointer"
          onClick={() => avatarInputRef.current?.click()}
          title="点击更换头像"
        >
          <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          <div className="absolute -inset-2 rounded-full opacity-60" style={{ background: 'radial-gradient(circle, #00ffff33, transparent 70%)' }} />
          <div
            className="relative h-16 w-16 overflow-hidden rounded-full"
            style={{ border: '2px solid #00ffff', boxShadow: '0 0 15px #00ffff88, 0 0 30px #00ffff33' }}
          >
            <img src={avatarSrc} alt="头像" className="h-full w-full object-cover object-top scale-110" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 font-black cyber-title"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', fontSize: '10px' }}
          >
            Lv{appState.level}
          </motion.div>
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="cyber-title whitespace-nowrap text-base font-black neon-text-cyan">
            {activeProfile ? `${activeProfile.avatarEmoji} ${activeProfile.name}` : '猪猪侠积分系统'}
          </div>
          <div className="mt-0.5 text-xs font-bold" style={{ color: '#ff2d78' }}>
            ◆ {levelName} · 连续坚持就会升级 ◆
          </div>
          <div className="mt-1 text-[11px]" style={{ color: '#94a3b8' }}>
            当前视觉：{styleProfile.label}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <motion.div
            whileTap={{ scale: 0.92 }}
            className="cyber-corner flex min-w-[52px] flex-col items-center rounded-xl px-3 py-2"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(255,0,0,0.08))',
              border: '1px solid rgba(255,107,0,0.5)',
              boxShadow: '0 0 10px rgba(255,107,0,0.2)',
            }}
          >
            <motion.span animate={{ scale: appState.streak >= 3 ? [1, 1.2, 1] : 1 }} transition={{ duration: 1, repeat: Infinity }} className="text-xl">
              {appState.streak >= 7 ? '🔥' : appState.streak >= 3 ? '⚡' : '✨'}
            </motion.span>
            <span className="text-sm font-black" style={{ color: '#ff6b00' }}>{appState.streak}</span>
            <span className="whitespace-nowrap text-xs text-gray-500">连续天</span>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.92 }}
            className="cyber-corner flex min-w-[52px] flex-col items-center rounded-xl px-3 py-2"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,165,0,0.06))',
              border: '1px solid rgba(255,215,0,0.5)',
              boxShadow: '0 0 10px rgba(255,215,0,0.2)',
            }}
          >
            <span className="text-xl">⚡</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={appState.totalPoints}
                initial={{ y: -10, opacity: 0, scale: 1.3 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="cyber-title text-sm font-black neon-text-gold"
              >
                {appState.totalPoints}
              </motion.span>
            </AnimatePresence>
            <span className="whitespace-nowrap text-xs text-gray-500">能量值</span>
          </motion.div>
        </div>
      </div>

      <div className="cyber-card cyber-corner p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="cyber-title text-xs text-cyan-400 opacity-80">ENERGY LEVEL</span>
          <span className="cyber-title text-xs" style={{ color: '#FFD700' }}>
            {appState.totalPoints} <span className="text-gray-600">/ {nextLevelPts}</span>
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full" style={{ background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.15)' }}>
          <motion.div
            className="relative h-full overflow-hidden rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ background: 'linear-gradient(90deg, #00ffff, #ff2d78)', boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff66' }}
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="text-xs text-gray-600">{levelName}</span>
          <span className="text-xs text-gray-600">{activeProfile?.target || '今天继续攒星星'}</span>
        </div>
      </div>
    </div>
  )
}
